import { ModelDefinition } from '@nestjs/mongoose';
import { Task, TaskSchema } from '../schema/tasks.schema';

export const taskDefinition: ModelDefinition = {
  schema: TaskSchema,
  name: Task.name,
};
