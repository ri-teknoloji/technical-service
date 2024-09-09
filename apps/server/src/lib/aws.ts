import { S3 } from "@aws-sdk/client-s3";
import crypto from "node:crypto";

class AwsClient {
  s3: S3;
  bucketName = process.env.AWS_BUCKET_NAME!;
  constructor() {
    this.s3 = new S3({
      region: "auto",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      endpoint: process.env.AWS_ENDPOINT,
      maxAttempts: 3,
    });
  }

  uploadFile = async (file: Express.Multer.File) => {
    const key = crypto.randomUUID();

    await this.s3.putObject({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    return key;
  };

  deleteFile = async (Key: string) => {
    const result = await this.s3.deleteObject({
      Bucket: this.bucketName,
      Key,
    });

    return result;
  };

  getFiles = async () => {
    const result = await this.s3.listObjects({
      Bucket: this.bucketName,
    });

    return result.Contents;
  };

  getFile = async (Key: string) => {
    try {
      const result = await this.s3.getObject({
        Bucket: this.bucketName,
        Key,
      });

      return result;
    } catch (err) {
      console.error(err);
      return null;
    }
  };
}

export const AWS = new AwsClient();
