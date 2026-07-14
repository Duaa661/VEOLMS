"use server";

import { requireUser } from "@/app/data/user/require-user";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/type";
import { request } from "@arcjet/next";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  }),
);

export async function enrollCourseAction(
  courseId: string,
): Promise<ApiResponse | never> {
  const user = await requireUser();
  let checkoutUrl: string;

  try {
    const req = await request();

    const decision = await aj.protect(req, {
      fingerprint: user.id,
    });

    if (decision.isDenied()) {
      return {
        status: "error",
        message: "You have been blocked",
      };
    }

    // check the course
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        title: true,
        price: true,
        slug: true,
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course Not Found",
      };
    }

    // check the user
    let stripeCustomerId: string;

    const userWithStripeCustomerId = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (userWithStripeCustomerId?.stripeCustomerId) {
      stripeCustomerId = userWithStripeCustomerId.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeCustomerId,
        },
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const enrollment = await tx.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },
        select: {
          id: true,
          status: true,
        },
      });

      if (enrollment?.status === "Active") {
        return {
          status: "error",
          message: "You are already enrolled in this Course",
        };
      }

      let enroll;

      if (enrollment) {
        enroll = await tx.enrollment.update({
          where: {
            id: enrollment.id,
          },
          data: {
            amount: course.price,
            status: "Pending",
            updatedAt: new Date(),
          },
        });
      } else {
        enroll = await tx.enrollment.create({
          data: {
            userId: user.id,
            courseId: course.id,
            amount: course.price,
            status: "Pending",
          },
        });
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
          {
            price: "price_1Tt8rh2OM79XbEdYwmtxd1Us",
            quantity: 1,
          },
        ],
        mode: "payment",
        metadata: {
          userId: user.id,
          courseId: course.id,
          enrollmentId: enroll.id,
        },
        success_url: `${env.BETTER_AUTH_URL}/payment/success`,
        cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
      });

      return {
        enrollment: enroll,
        checkoutUrl: checkoutSession.url,
      };
    });

   
    checkoutUrl = result.checkoutUrl as string;
  }
  catch (error) {
  console.error("Stripe Error:", error);

  if (error instanceof Stripe.errors.StripeError) {
    return {
      status: "error",
      message: error.message,
    };
  }

  console.error("Unknown Error:", error);

  return {
    status: "error",
    message: "Failed to enroll in Course",
  };
}

  redirect(checkoutUrl);
}