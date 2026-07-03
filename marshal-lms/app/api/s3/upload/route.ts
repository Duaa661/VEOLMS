import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "@/lib/env";
import { s3 } from "@/lib/s3Client";

const fileUploadSchema = z.object({
  filename: z.string().min(1, {
    message: "Filename is required",
  }),
  contentType: z.string().min(1, {
    message: "Content type is required",
  }),
  size: z.number().min(1, {
    message: "Size is required",
  }),
  isImage: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const { filename, contentType} = validation.data;

    const key = `uploads/${randomUUID()}-${filename}`;

     const command = new PutObjectCommand({
       Bucket: process.env.AWS_BUCKET_NAME!,
       Key: key,
       ContentType: contentType,
     });
    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 60 * 5,
    });

    const fileUrl = `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({
      success: true,
      uploadUrl,
      key,
      fileUrl,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}