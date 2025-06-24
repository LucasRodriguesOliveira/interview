import { Provider } from '@nestjs/common';
import { TaskRepository } from '../../repository/task/task.repository';
import { CryptoService } from '../../service/crypto/crypto.service';
import { ExtendedNestLoggerService } from '../../service/logger/extended-nest-logger.service';
import { ITaskRepository } from '../../../domain/repository/task.interface';
import { ICryptoService } from '../../../domain/service/crypto.interface';
import { ILoggerService } from '../../../domain/service/logger.interface';
import { Proxy } from '..';
import { FindTaskUseCase } from '../../../application/usecase/task/find-task.usecase';

const token = Symbol('__FIND_TASK_USE_CASE__');
const provider: Provider = {
  provide: token,
  inject: [TaskRepository, CryptoService, ExtendedNestLoggerService],
  useFactory: (
    taskRepository: ITaskRepository,
    cryptoService: ICryptoService,
    loggerService: ILoggerService,
  ) => new FindTaskUseCase(taskRepository, cryptoService, loggerService),
};

export const FindTaskProxy = new Proxy(token, provider);
