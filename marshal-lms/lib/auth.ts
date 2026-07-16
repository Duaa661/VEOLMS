
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { prisma } from "./db";
import { env } from "./env";
import { resend } from "./resend";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },

  plugins: [
    admin(),
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        // implement sending the email to the user
        await resend.emails.send({
          from: "VeoLms <onboarding@resend.dev>",
          to: email,
          subject: "VeoLms - verify your email",
          html: `<p>Your otp is <strong>${otp}</strong></p>
          `,
        });
      },
    }),
  ],
});
