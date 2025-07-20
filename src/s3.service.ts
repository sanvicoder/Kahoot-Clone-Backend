import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private configService: ConfigService) {
this.bucketName = this.configService.get<string>('AWS_S3_BUCKET')!;
this.region = this.configService.get<string>('AWS_REGION')!;
const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID')!;
const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY')!;


    if (!accessKeyId || !secretAccessKey) {
      throw new Error('AWS credentials are missing in environment variables');
    }

    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileExt = path.extname(file.originalname);
    const key = `quiz-images/${uuid()}${fileExt}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }
}
