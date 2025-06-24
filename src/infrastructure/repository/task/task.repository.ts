import { InjectModel } from '@nestjs/mongoose';
import { Task } from '../../database/mongodb/schema/tasks.schema';
import { Model } from 'mongoose';
import { ITaskRepository } from '../../../domain/repository/task.interface';
import { TaskModel } from '../../../domain/model/task';
import { plainToInstance } from 'class-transformer';
import { CreateTaskPresenter } from './presenter/create-task.presenter';
import { ListTaskPresenter } from './presenter/list-task.presenter';
import { FindTaskPresenter } from './presenter/find-task.presenter';

export class TaskRepository implements ITaskRepository {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<Task>,
  ) {}

  public async create(taskData: Partial<TaskModel>): Promise<TaskModel> {
    const taskCreated = await this.taskModel.create(taskData);

    return plainToInstance(CreateTaskPresenter, taskCreated.toObject());
  }

  public async findAll(): Promise<TaskModel[]> {
    const tasks = await this.taskModel.find().exec();

    return plainToInstance(ListTaskPresenter, tasks.map((task) => task.toObject()))
  }

  public async findOne(id: string): Promise<TaskModel> {
    const task = await this.taskModel.findById(id).exec();

    return plainToInstance(FindTaskPresenter, task?.toObject());
  }
}
