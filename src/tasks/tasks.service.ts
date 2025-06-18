import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/tasks.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private repository: Model<Task>) {}

  create() {
    throw new Error('Not implemented');
  }

  findAll() {
    throw new Error('Not implemented');
  }

  findOne() {
    throw new Error('Not implemented');
  }
}
