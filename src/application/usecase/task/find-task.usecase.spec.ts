import { Test, TestingModule } from '@nestjs/testing';
import { ITaskRepository } from '../../../domain/repository/task.interface';
import { ICryptoService } from '../../../domain/service/crypto.interface';
import { ILoggerService } from '../../../domain/service/logger.interface';
import { FindTaskUseCase } from './find-task.usecase';
import { TaskRepository } from '../../../infrastructure/repository/task/task.repository';
import { CryptoService } from '../../../infrastructure/service/crypto/crypto.service';
import { ExtendedNestLoggerService } from '../../../infrastructure/service/logger/extended-nest-logger.service';
import { fakerPT_BR } from '@faker-js/faker/.';
import { TaskModel } from '../../../domain/model/task';

const taskRepositoryMock = {
  findOne: jest.fn(),
};

const cryptoServiceMock = {
  decrypt: jest.fn(),
};

const loggerServiceMock = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

describe(FindTaskUseCase.name, () => {
  let findTaskUseCase: FindTaskUseCase;
  let taskRepository: jest.Mocked<ITaskRepository>;
  let cryptoService: jest.Mocked<ICryptoService>;
  let loggerService: jest.Mocked<ILoggerService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FindTaskUseCase,
          inject: [TaskRepository, CryptoService, ExtendedNestLoggerService],
          useFactory: (
            taskRepository: ITaskRepository,
            cryptoService: ICryptoService,
            loggerService: ILoggerService,
          ) =>
            new FindTaskUseCase(taskRepository, cryptoService, loggerService),
        },
        {
          provide: TaskRepository,
          useValue: taskRepositoryMock,
        },
        {
          provide: CryptoService,
          useValue: cryptoServiceMock,
        },
        {
          provide: ExtendedNestLoggerService,
          useValue: loggerServiceMock,
        },
      ],
    }).compile();

    findTaskUseCase = app.get<FindTaskUseCase>(FindTaskUseCase);
    taskRepository = app.get(TaskRepository);
    cryptoService = app.get(CryptoService);
    loggerService = app.get(ExtendedNestLoggerService);
  });

  it('should be defined', () => {
    expect(findTaskUseCase).toBeDefined();
    expect(taskRepository).toBeDefined();
    expect(cryptoService).toBeDefined();
    expect(loggerService).toBeDefined();
  });

  describe('byId', () => {
    const taskId = fakerPT_BR.database.mongodbObjectId();

    const task: TaskModel = {
      id: taskId,
      title: fakerPT_BR.lorem.sentence(),
      description: fakerPT_BR.lorem.paragraph(),
      user: fakerPT_BR.internet.email(),
      date: fakerPT_BR.date.anytime(),
    };

    describe('Success', () => {
      beforeAll(() => {
        taskRepositoryMock.findOne.mockResolvedValue(task);
        cryptoServiceMock.decrypt.mockReturnValue(task.user);
      });

      it('should return a task by id', async () => {
        const result = await findTaskUseCase.byId(taskId);

        expect(result).toHaveProperty('value');
        expect(result).not.toHaveProperty('error');
        expect(result.value).toEqual(task);
        expect(taskRepositoryMock.findOne).toHaveBeenCalledWith<[string]>(
          taskId,
        );
        expect(cryptoServiceMock.decrypt).toHaveBeenCalledWith<[string]>(
          task.user,
        );
        expect(loggerServiceMock.log).toHaveBeenCalledWith<[string, string]>(
          FindTaskUseCase.name,
          `Task [${task.id}] found.`,
        );
      });
    });

    describe('not found', () => {
      const taskId = fakerPT_BR.database.mongodbObjectId();
      const errorMessage = `Task [${taskId}] does not exist.`;
      const errorResponse = {
        code: 'COULD_NOT_FIND_TASK',
        message: errorMessage,
      };

      beforeAll(() => {
        taskRepositoryMock.findOne.mockResolvedValue(null);
      });

      it('should return an error if the task does not exist', async () => {
        const result = await findTaskUseCase.byId(taskId);

        expect(result).toHaveProperty('error');
        expect(result).not.toHaveProperty('value');
        expect(result.error).toEqual(errorResponse);
        expect(taskRepositoryMock.findOne).toHaveBeenCalledWith<[string]>(
          taskId,
        );
        expect(loggerServiceMock.warn).toHaveBeenCalledWith<[string, string]>(
          FindTaskUseCase.name,
          errorMessage,
        );
      });
    });

    describe('error', () => {
      const taskId = fakerPT_BR.database.mongodbObjectId();
      const errorMessage = 'Task could not be found';
      const errorResponse = {
        code: 'COULD_NOT_FIND_TASK',
        message: errorMessage,
      };

      beforeAll(() => {
        taskRepositoryMock.findOne.mockRejectedValue(new Error(errorMessage));
      });

      it('should return an error if an exception occurs', async () => {
        const result = await findTaskUseCase.byId(taskId);

        expect(result).toHaveProperty('error');
        expect(result).not.toHaveProperty('value');
        expect(result.error).toEqual(errorResponse);
        expect(taskRepositoryMock.findOne).toHaveBeenCalledWith<[string]>(
          taskId,
        );
        expect(loggerServiceMock.error).toHaveBeenCalled();
      });
    });
  });
});
