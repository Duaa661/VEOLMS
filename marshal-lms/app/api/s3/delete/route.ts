import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

import { s3 } from "@/lib/s3Client"; // your configured S3 client
import { env } from "@/lib/env";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { requireAdmin } from "@/app/data/admin/require-admin";

const aj = arcjet.withRule(
  detectBot({
    mode: "LIVE",
    allow:[]
  })
).withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max:5
  })
)
export async function DELETE(request: Request) {
  const session =await requireAdmin()
  try {
    
        const decision = await aj.protect(request, {
          fingerprint: session?.user.id as string
        })
        if (decision.isDenied()) {
          return NextResponse.json({error:"Brother it not Good"},{status:429})
        }
    const { key } = await request.json();

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Missing or invalid object key.",
        },
        {
          status: 400,
        }
      );
    }

    const command = new DeleteObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
    });

    await s3.send(command);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully.",
    });
  } catch (error) {
     console.log(error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete file.",
      },
      {
        status: 500,
      }
    );
  }
}