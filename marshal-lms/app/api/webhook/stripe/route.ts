import { headers } from "next/headers";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();

  const headerList = await headers();
  const signature = headerList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);

    return new Response("Invalid signature", {
      status: 400,
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.userId;
        const courseId = session.metadata?.courseId;
        const enrollmentId = session.metadata?.enrollmentId;
        const customerId = session.customer as string;

        if (!userId || !courseId || !enrollmentId || !customerId) {
          return new Response("Missing metadata", {
            status: 400,
          });
        }

        const user = await prisma.user.findUnique({
          where: {
            stripeCustomerId: customerId,
          },
        });

        if (!user) {
          throw new Error("User Not Found...");
        }

        await prisma.enrollment.update({
          where: {
            id: enrollmentId,
          },
          data: {
            userId: user.id,
            courseId: courseId,
            amount: session.amount_total ?? 0,
            status: "Active",
          },
        });

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return Response.json(
      {
        received: true,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Webhook Error:", error);

    return new Response("Webhook handler failed", {
      status: 500,
    });
  }
}