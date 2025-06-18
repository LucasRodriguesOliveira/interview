import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CryptoService } from 'src/helper/crypto.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './schemas/tasks.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private repository: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      const task = new this.repository({
        ...createTaskDto,
        user: CryptoService.encrypt(createTaskDto.userMail),
      });
      const result = await task.save();
      return {
        ...result.toObject(),
        user: CryptoService.decrypt(result.user),
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      const tasks = await this.repository.find().exec();
      return tasks.map((task) => ({
        ...task.toObject(),
        user: CryptoService.decrypt(task.user),
      }));
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const task = await this.repository.findById(id);
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      return {
        ...task.toObject(),
        user: CryptoService.decrypt(task.user),
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
