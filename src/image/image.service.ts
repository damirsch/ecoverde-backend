// upload.service.ts
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class ImageService {
  private uploadPath = join(__dirname, '..', '..', 'uploads');
  constructor() {
    fs.mkdir(this.uploadPath, { recursive: true }).catch(console.error);
  }
  async saveImage(file): Promise<string> {
    const uniqueFilename = `${uuidv4()}_${file.originalname}`;
    const filePath = join(this.uploadPath, uniqueFilename);
    await fs.writeFile(filePath, file.buffer);
    return `/uploads/${uniqueFilename}`;
  }
}
