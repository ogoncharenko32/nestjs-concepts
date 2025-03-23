import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';

@Injectable()
export class FileUploadService {
  constructor(private prisma: PrismaService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async upload(file: Express.Multer.File) {
    try {
      const uploadResult = await this.uploadToCloudinary(file.path);

      const newlySavedFile = await this.prisma.file.create({
        data: {
          filename: file.originalname,
          publicId: uploadResult.public_id,
          url: uploadResult.secure_url,
        },
      });

      fs.unlinkSync(file.path);
      return newlySavedFile;
    } catch (error) {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new InternalServerErrorException('Error uploading file');
    }
  }
  private uploadToCloudinary(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(filePath, (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  }

  async deleteFile(fileId: string) {
    try {
      const file = await this.prisma.file.findUnique({
        where: {
          id: fileId,
        },
      });
      if (!file) {
        throw new InternalServerErrorException('File not found');
      }

      await cloudinary.uploader.destroy(file.publicId);

      await this.prisma.file.delete({
        where: {
          id: fileId,
        },
      });
      return {
        message: 'File deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting file ${fileId}. ${error}`,
      );
    }
  }
}
