export interface INewTask {
  title: string;
  notes: string;
  description: string;
  time: number;
}

export interface ITask extends INewTask {
  id: string;
  status: 'open' | 'started' | 'completed';
  startedDate?: Date;
  completedDate?: Date;
  beforeImageFiles?: string[];
  afterImageFiles?: string[];
}