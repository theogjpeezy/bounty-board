export interface INewTask {
  title: string;
  notes: string;
  description: string;
  time: number;
}

export interface ITask extends INewTask {
  id: string;
  status: 'open' | 'started' | 'completed';
  startedDate?: string;
  completedDate?: string;
  beforeImageFiles?: string[];
  afterImageFiles?: string[];
}