export interface INewTask {
  title: string;
  notes: string;
  description: string;
  time: number;
}

export interface ITask extends INewTask {
  id: string;
  completed: boolean;
  completedDate: Date;
  image: any;
}