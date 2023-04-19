
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { addTask, deleteTask, getTask, updateTask } from '@/db'
import { ITask } from '@/db/tasks';
import { isString } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ITask>
) {
  switch(req.method) {
    case 'GET': {
      if (!isString(req.query)) return res.status(500);
      const task = await getTask(req.query);
      if (!task) return res.status(404);
      return res.status(200).json(task as any);
    }
    case 'PUT': {
      await updateTask(JSON.parse(req.body));
      return res.status(200).json({} as any);
    }
    case 'DELETE': {
      if (!isString(req.query)) return res.status(500);
      await deleteTask(req.query);
      return res.status(204).json({} as any);
    }
  }
}
