const BUCKET = "veolms";
const REGION = "us-east-1";

export function constructObjectUrl(key: string) {
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}