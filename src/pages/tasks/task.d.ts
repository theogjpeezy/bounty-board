export interface ITask {
  title: string;
  notes: string;
  time: number;
  completed?: boolean;
  completedDate?: Date;
  image: string;
}