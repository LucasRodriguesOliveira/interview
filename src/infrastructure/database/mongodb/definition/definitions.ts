import { ModelDefinition } from '@nestjs/mongoose';
import { taskDefinition } from './task.definiton';

export const mongooseDefinitions: ModelDefinition[] = [taskDefinition];
