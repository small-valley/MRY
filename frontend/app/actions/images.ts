/*


import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { AWS_BUCKET_NAME, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '../env';

const s3 = new S3Client({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  region: AWS_REGION,
});

const storage = multer.memoryStorage();
const multerFilter = (_req: any, file: any) => {
  if (file.mimetype.startsWith('image/jpeg') || file.mimetype.startsWith('image/png')) {
    cb(null, true);
  } else {
    cb(new Error(`upload format : jpg, jpeg, png `));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

const uploadToS3 = async (fileName: string, buffer: Buffer, imageType: string, folder: string): Promise<string> => {
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: `${folder}/${fileName}`,
    Body: buffer,
    ContentType: imageType,
  };

  console.log(params);
  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    return `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${folder}/${fileName}`;
  } catch (error) {
    console.error(error);
    throw new Error('fail to upload image in S3');
  }
};

export const deleteFromS3 = async (filePath: string): Promise<void> => {
  const fileName = filePath.split('/').pop();

  if (!fileName) {
    throw new Error('fail to extract file name');
  }

  const folder = 'photo';

  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: `${folder}/${fileName}`,
  };

  console.log(params);

  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
  } catch (error) {
    throw new Error('fail to delete image in S3');
  }
};

export const UploadFileToS3 = async (file: any) => {
  const fileName = Date.now() + '-' + file.originalname;
  const buffer = file.buffer;
  const imageType = file.mimetype;

  const ImageUrl = await uploadToS3(fileName, buffer, imageType, 'photo');

  return {
    ImageUrl,
  };
};
*/
