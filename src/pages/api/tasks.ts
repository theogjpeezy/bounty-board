// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { addTask, getTask, getTasks } from '@/db'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST': {
      await addTask(JSON.parse(req.body));
      res.status(201).json({});
      break;
    }
    case 'GET': {
      const tasks = await getTasks();
      res.status(200).json(tasks);
      break;
    }
  }
}
