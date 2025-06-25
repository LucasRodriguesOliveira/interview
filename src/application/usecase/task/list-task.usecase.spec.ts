import { Test, TestingModule } from '@nestjs/testing';
import { ITaskRepository } from '../../../domain/repository/task.interface';
import { ICryptoService } from '../../../domain/service/crypto.interface';
import { ILoggerService } from '../../../domain/service/logger.interface';
import { ListTaskUseCase } from './list-task.usecase';
import { TaskRepository } from '../../../infrastructure/repository/task/task.repository';
import { CryptoService } from '../../../infrastructure/service/crypto/crypto.service';
import { ExtendedNestLoggerService } from '../../../infrastructure/service/logger/extended-nest-logger.service';
import { TaskModel } from '../../../domain/model/task';
import { fakerPT_BR } from '@faker-js/faker/.';

const taskRepositoryMock = {
  findAll: jest.fn(),
};

const cryptoServiceMock = {
  decrypt: jest.fn(),
};

const loggerServiceMock = {
  log: jest.fn(),
  error: jest.fn(),
};

describe(ListTaskUseCase.name, () => {
  let listTaskUseCase: ListTaskUseCase;
  let taskRepository: jest.Mocked<ITaskRepository>;
  let cryptoService: jest.Mocked<ICryptoService>;
  let loggerService: jest.Mocked<ILoggerService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ListTaskUseCase,
          inject: [TaskRepository, CryptoService, ExtendedNestLoggerService],
          useFactory: (
            taskRepository: ITaskRepository,
            cryptoService: ICryptoService,
            loggerService: ILoggerService,
          ) =>
            new ListTaskUseCase(taskRepository, cryptoService, loggerService),
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

    listTaskUseCase = app.get<ListTaskUseCase>(ListTaskUseCase);
    taskRepository = app.get(TaskRepository);
    cryptoService = app.get(CryptoService);
    loggerService = app.get(ExtendedNestLoggerService);
  });

  it('should be defined', () => {
    expect(listTaskUseCase).toBeDefined();
    expect(taskRepository).toBeDefined();
    expect(cryptoService).toBeDefined();
    expect(loggerService).toBeDefined();
  });

  describe('run', () => {
    describe('success', () => {
      const taskList: TaskModel[] = [
        {
          id: fakerPT_BR.database.mongodbObjectId(),
          title: fakerPT_BR.lorem.sentence(),
          description: fakerPT_BR.lorem.paragraph(),
          user: fakerPT_BR.internet.email(),
          date: fakerPT_BR.date.anytime(),
        },
      ];

      beforeAll(() => {
        taskRepository.findAll.mockResolvedValue(taskList);
        cryptoService.decrypt.mockImplementation((value) => value);
      });

      it('should return a list of tasks', async () => {
        const result = await listTaskUseCase.run();

        expect(result).toHaveProperty('value');
        expect(result).not.toHaveProperty('error');
        expect(result.value).toEqual(taskList);
        expect(taskRepository.findAll).toHaveBeenCalled();
        expect(cryptoService.decrypt).toHaveBeenCalledTimes(taskList.length);
        expect(loggerService.log).toHaveBeenCalledWith(
          ListTaskUseCase.name,
          `Listing [${taskList.length}] tasks`,
        );
      });
    });

    describe('failure', () => {
      beforeAll(() => {
        taskRepository.findAll.mockImplementationOnce(() => {
          throw new Error('Database error');
        });
      });

      it('should return an error response', async () => {
        const result = await listTaskUseCase.run();

        expect(result).toHaveProperty('error');
        expect(result.error).toEqual({
          code: 'UNEXPECTED',
          message: 'Could not get a list of tasks',
        });
        expect(result).not.toHaveProperty('value');
        expect(taskRepository.findAll).toHaveBeenCalled();
        expect(loggerService.error).toHaveBeenCalled();
      });
    });
  });
});
