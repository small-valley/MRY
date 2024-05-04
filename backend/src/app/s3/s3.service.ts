import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  private s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  constructor() {
    AWS.config.update({
      region: process.env.AWS_REGION,
    });
  }

  async uploadImage(imageData: Buffer, userId: string): Promise<string> {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME || '',
      Key: `avatars/${userId}.png`,
      Body: imageData,
      ACL: 'public-read',
      ContentType: 'image/png',
    };

    const { Location } = await this.s3.upload(params).promise();
    return Location;
  }
}
