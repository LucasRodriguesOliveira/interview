import { Provider } from '@nestjs/common';
import { CreateTaskProxy } from './create-task.proxy';
import { FindTaskProxy } from './find-task.proxy';
import { ListTaskProxy } from './list-task.proxy';

export const TaskProxies: Map<symbol, Provider> = new Map([
  CreateTaskProxy.Entry,
  FindTaskProxy.Entry,
  ListTaskProxy.Entry,
]);
