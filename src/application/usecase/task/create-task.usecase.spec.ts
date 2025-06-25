import { TestingModule, Test } from '@nestjs/testing';
import { ITaskRepository } from '../../../domain/repository/task.interface';
import { ICryptoService } from '../../../domain/service/crypto.interface';
import { ILoggerService } from '../../../domain/service/logger.interface';
import { CreateTaskUsecase } from './create-task.usecase';
import { TaskRepository } from '../../../infrastructure/repository/task/task.repository';
import { CryptoService } from '../../../infrastructure/service/crypto/crypto.service';
import { ExtendedNestLoggerService } from '../../../infrastructure/service/logger/extended-nest-logger.service';
import { TaskModel } from '../../../domain/model/task';
import { fakerPT_BR } from '@faker-js/faker';

const taskRepositoryMock = {
  create: jest.fn(),
};

const cryptoServiceMock = {
  encrypt: jest.fn(),
  decrypt: jest.fn(),
};

const loggerServiceMock = {
  log: jest.fn(),
  error: jest.fn(),
};

describe(CreateTaskUsecase.name, () => {
  let createTaskUseCase: CreateTaskUsecase;
  let taskRepository: jest.Mocked<ITaskRepository>;
  let cryptoService: jest.Mocked<ICryptoService>;
  let loggerService: jest.Mocked<ILoggerService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateTaskUsecase,
          inject: [TaskRepository, CryptoService, ExtendedNestLoggerService],
          useFactory: (
            taskRepository: ITaskRepository,
            cryptoService: ICryptoService,
            loggerService: ILoggerService,
          ) =>
            new CreateTaskUsecase(taskRepository, cryptoService, loggerService),
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

    createTaskUseCase = app.get<CreateTaskUsecase>(CreateTaskUsecase);
    taskRepository = app.get(TaskRepository);
    cryptoService = app.get(CryptoService);
    loggerService = app.get(ExtendedNestLoggerService);
  });

  it('should be defined', () => {
    expect(loggerService).toBeDefined();
    expect(cryptoService).toBeDefined();
    expect(taskRepository).toBeDefined();
    expect(createTaskUseCase).toBeDefined();
  });

  describe('run', () => {
    const taskData: Partial<TaskModel> = {
      title: fakerPT_BR.book.title(),
      description: fakerPT_BR.lorem.words(5),
      user: fakerPT_BR.internet.email(),
      date: fakerPT_BR.date.anytime(),
    };

    describe('Success', () => {
      const taskCreated: TaskModel = {
        id: fakerPT_BR.database.mongodbObjectId(),
        title: taskData.title!,
        description: taskData.description!,
        user: taskData.user!,
        date: taskData.date!,
      };

      beforeAll(() => {
        cryptoServiceMock.encrypt.mockReturnValueOnce(taskData.user);
        // cryptoServiceMock.decrypt.mockReturnValueOnce(taskData.user);
        taskRepositoryMock.create.mockResolvedValueOnce(taskCreated);
      });

      it('should create a task with encrypted user email', async () => {
        const result = await createTaskUseCase.run(taskData);

        expect(result).toHaveProperty('value');
        expect(result).not.toHaveProperty('error');
        expect(result.value).toBe(taskCreated);
        expect(cryptoService.encrypt).toHaveBeenCalledWith<[string]>(
          taskData.user!,
        );
        // expect(cryptoService.decrypt).toHaveBeenCalledWith<[string]>(
        //   taskData.user!,
        // );
        expect(loggerService.log).toHaveBeenCalledWith<[string, string]>(
          CreateTaskUsecase.name,
          `Task [${taskCreated.id}] created!`,
        );
      });
    });

    describe('fail', () => {
      //I could check every fail possible, but since the usecase handle every
      // fail, i'll consider for this test only repository failures

      beforeAll(() => {
        cryptoServiceMock.encrypt.mockReturnValueOnce(taskData.user);
        taskRepositoryMock.create.mockImplementationOnce(() => {
          throw new Error('Could not create a task');
        });
      });

      it('should fail for invalid data and handle failure elegantly', async () => {
        const result = await createTaskUseCase.run(taskData);

        expect(result).not.toHaveProperty('value');
        expect(result).toHaveProperty('error');
        expect(result.error?.code).toBe('COULD_NOT_CREATE_TASK');
        expect(cryptoService.encrypt).toHaveBeenCalledWith<[string]>(
          taskData.user!,
        );
        expect(taskRepository.create).toHaveBeenCalledWith<
          [Partial<TaskModel>]
        >(taskData);
        expect(loggerService.error).toHaveBeenCalled();
      });
    });
  });
});
