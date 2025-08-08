import fs from 'node:fs/promises';
import path from 'node:path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'avatars');

export async function saveAvatar(fileBuffer: Buffer, originalFilename: string, internId: string): Promise<string> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const fileExtension = path.extname(originalFilename);
  const uniqueFilename = `${internId}-${Date.now()}${fileExtension}`;
  const filePath = path.join(UPLOAD_DIR, uniqueFilename);

  await fs.writeFile(filePath, fileBuffer);

  const publicImageUrl = `/uploads/avatars/${uniqueFilename}`;
  
  console.log(`File saved for intern ${internId} at: ${filePath}`);

  return publicImageUrl;
}