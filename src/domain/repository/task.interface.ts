import { TaskModel } from '../model/task';

export interface ITaskRepository {
  create(taskData: Partial<TaskModel>): Promise<TaskModel>;
  findOne(taskId: string): Promise<TaskModel>;
  findAll(): Promise<TaskModel[]>;
}
