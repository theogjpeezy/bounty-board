import { MongoClient, Db, ObjectId } from 'mongodb';
import { INewTask, ITask } from './tasks';

const MONGODB_URI: string = "mongodb://admin:admin@localhost:27017/?authMechanism=DEFAULT";
const MONGODB_DB: string = "admin";

export async function getTasks() {
  const { db } = await connectToDatabase();
  const results = await db.collection('tasks').find().toArray();
  return results.map(result => ({
    id: result._id.toString(),
    title: result.title,
    description: result.description,
    time: result.time,
    completed: result.completed,
    notes: result.notes
  }));
}

export async function getTask(id: string) {
  const { db } = await connectToDatabase();
  const result = await db.collection('tasks').findOne<ITask>({'_id': new ObjectId(id)});
  return {
    title: result?.title,
    time: result?.time,
    description: result?.description,
    notes: result?.notes
  }
}

export async function addTask(task: INewTask) {
  const { db } = await connectToDatabase();
  return db.collection('tasks').insertOne({...task, completed: false});
}

export async function deleteTask(id: string) {

}

export async function updateTask(task: any) {

}

let cachedClient: MongoClient;
let cachedDb: Db;

export async function connectToDatabase() {
  // check the cached.
  if (cachedClient && cachedDb) {
      // load from cache
      return {
          client: cachedClient,
          db: cachedDb,
      };
  }

  // Connect to cluster
  let client = new MongoClient(MONGODB_URI);
  await client.connect();
  let db = client.db(MONGODB_DB);

  // set cache
  cachedClient = client;
  cachedDb = db;

  return {
      client: cachedClient,
      db: cachedDb,
  };
}