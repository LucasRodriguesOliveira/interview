import { Provider } from '@nestjs/common';
import { TaskRepository } from '../../repository/task/task.repository';
import { Proxy } from '..';
import { ITaskRepository } from '../../../domain/repository/task.interface';
import { ICryptoService } from '../../../domain/service/crypto.interface';
import { ILoggerService } from '../../../domain/service/logger.interface';
import { CryptoService } from '../../service/crypto/crypto.service';
import { ExtendedNestLoggerService } from '../../service/logger/extended-nest-logger.service';
import { CreateTaskUsecase } from '../../../application/usecase/task/create-task.usecase';

const token = Symbol('__CREATE_TASK_USE_CASE__');
const provider: Provider = {
  provide: token,
  inject: [TaskRepository, CryptoService, ExtendedNestLoggerService],
  useFactory: (
    taskRepository: ITaskRepository,
    cryptoService: ICryptoService,
    loggerService: ILoggerService,
  ) => new CreateTaskUsecase(taskRepository, cryptoService, loggerService),
};

export const CreateTaskProxy = new Proxy(token, provider);
