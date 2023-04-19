// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { randomUUID } from 'crypto';
import formidable from 'formidable';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path';

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = new formidable.IncomingForm();
  const id = randomUUID();
  form.parse(req, async (err, fields, files) => {
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const data = fs.readFileSync(file.filepath);
    const ext = file.originalFilename!.split('.').pop();
    const savePath = path.join(process.cwd(), `public/uploads/${id}.${ext}`);
    fs.writeFile(savePath, data, (err) => {
      return res.status(201).send(`${id}.${ext}`)
    });
  });
}
