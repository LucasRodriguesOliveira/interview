import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/tasks.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private repository: Model<Task>) {}

  create() {
    throw new NotImplementedException('Method not implemented');
  }

  findAll() {
    throw new NotImplementedException('Method not implemented');
  }

  findOne() {
    throw new NotImplementedException('Method not implemented');
  }
}
