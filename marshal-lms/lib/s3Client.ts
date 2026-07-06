import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@/lib/env";

export const s3 = new S3Client({
  region: env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: env.AWS_S3_ACCESSKEY,
    secretAccessKey: env.AWS_S3_SECRETKEY,
  },
});