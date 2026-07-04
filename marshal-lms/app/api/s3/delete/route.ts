import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

import { s3 } from "@/lib/s3Client"; // your configured S3 client
import { env } from "@/lib/env";

export async function DELETE(request: Request) {
  try {
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