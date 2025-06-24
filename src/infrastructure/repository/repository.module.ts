import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseDefinitions } from '../database/mongodb/definition/definitions';
import { TaskRepository } from './task/task.repository';

@Module({
  imports: [MongooseModule.forFeature(mongooseDefinitions)],
  providers: [TaskRepository],
  exports: [TaskRepository],
})
export class RepositoryModule {}
