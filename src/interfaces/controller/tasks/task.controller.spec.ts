import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskUsecase } from '../../../application/usecase/task/create-task.usecase';
import { FindTaskUseCase } from '../../../application/usecase/task/find-task.usecase';
import { ListTaskUseCase } from '../../../application/usecase/task/list-task.usecase';
import { HttpExceptionService } from '../../../infrastructure/exception/http-exception.service';
import { TaskController } from './task.controller';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskProxy } from '../../../infrastructure/proxy/tasks/create-task.proxy';
import { FindTaskProxy } from '../../../infrastructure/proxy/tasks/find-task.proxy';
import { ListTaskProxy } from '../../../infrastructure/proxy/tasks/list-task.proxy';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateTaskDto } from './dto/create-task.dto';
import { fakerPT_BR } from '@faker-js/faker/.';
import { TaskModel } from '../../../domain/model/task';

const createTaskUseCaseMock = {
  run: jest.fn(),
};

const findTaskUseCaseMock = {
  byId: jest.fn(),
};

const listTaskUseCaseMock = {
  run: jest.fn(),
};

const exceptionServiceMock = {
  badRequest: jest.fn().mockImplementation(() => {
    throw new BadRequestException();
  }),
  notFound: jest.fn().mockImplementation(() => {
    throw new NotFoundException();
  }),
  internalServerError: jest.fn().mockImplementation(() => {
    throw new InternalServerErrorException();
  }),
};

describe(TaskController.name, () => {
  let taskController: TaskController;
  let createTaskUseCase: jest.Mocked<CreateTaskUsecase>;
  let findTaskUseCase: jest.Mocked<FindTaskUseCase>;
  let listTaskUseCase: jest.Mocked<ListTaskUseCase>;
  let exceptionService: jest.Mocked<HttpExceptionService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateTaskProxy.Token,
          useValue: createTaskUseCaseMock,
        },
        {
          provide: FindTaskProxy.Token,
          useValue: findTaskUseCaseMock,
        },
        {
          provide: ListTaskProxy.Token,
          useValue: listTaskUseCaseMock,
        },
        {
          provide: HttpExceptionService,
          useValue: exceptionServiceMock,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
      ],
      controllers: [TaskController],
    }).compile();

    taskController = app.get<TaskController>(TaskController);
    createTaskUseCase = app.get(CreateTaskProxy.Token);
    findTaskUseCase = app.get(FindTaskProxy.Token);
    listTaskUseCase = app.get(ListTaskProxy.Token);
    exceptionService = app.get(HttpExceptionService);
  });

  it('should be defined', () => {
    expect(taskController).toBeDefined();
    expect(createTaskUseCase).toBeDefined();
    expect(findTaskUseCase).toBeDefined();
    expect(listTaskUseCase).toBeDefined();
    expect(exceptionService).toBeDefined();
  });

  describe('create', () => {
    const createTaskDto: CreateTaskDto = {
      title: fakerPT_BR.lorem.sentence(),
      description: fakerPT_BR.lorem.paragraph(),
      userEmail: fakerPT_BR.internet.email(),
      date: fakerPT_BR.date.anytime(),
    };

    describe('success', () => {
      const taskCreated: TaskModel = {
        id: fakerPT_BR.database.mongodbObjectId(),
        title: createTaskDto.title,
        description: createTaskDto.description,
        user: createTaskDto.userEmail,
        date: createTaskDto.date,
      };

      beforeAll(() => {
        createTaskUseCaseMock.run.mockResolvedValueOnce({ value: taskCreated });
      });

      it('should create a task successfully', async () => {
        const result = await taskController.create(createTaskDto);
        expect(result).toEqual(taskCreated);
        expect(createTaskUseCaseMock.run).toHaveBeenCalledWith({
          ...createTaskDto,
          user: createTaskDto.userEmail,
        });
      });
    });

    describe('failure', () => {
      beforeAll(() => {
        createTaskUseCaseMock.run.mockResolvedValueOnce({
          error: { message: 'Error creating task' },
        });
      });

      it('should throw BadRequestException when task creation fails', async () => {
        await expect(taskController.create(createTaskDto)).rejects.toThrow(
          BadRequestException,
        );
        expect(exceptionService.badRequest).toHaveBeenCalledWith({
          message: 'Error creating task',
        });
      });
    });
  });

  describe('list', () => {
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
        listTaskUseCaseMock.run.mockResolvedValueOnce({ value: taskList });
      });

      it('should list tasks successfully', async () => {
        const result = await taskController.list();
        expect(result).toEqual(taskList);
        expect(listTaskUseCaseMock.run).toHaveBeenCalled();
      });
    });

    describe('failure', () => {
      beforeAll(() => {
        listTaskUseCaseMock.run.mockResolvedValueOnce({
          error: { message: 'Error listing tasks' },
        });
      });

      it('should throw InternalServerErrorException when task listing fails', async () => {
        await expect(taskController.list()).rejects.toThrow(
          InternalServerErrorException,
        );
        expect(exceptionService.internalServerError).toHaveBeenCalledWith({
          message: 'Error listing tasks',
        });
      });
    });
  });

  describe('findById', () => {
    const taskId = fakerPT_BR.database.mongodbObjectId();

    describe('success', () => {
      const task: TaskModel = {
        id: taskId,
        title: fakerPT_BR.lorem.sentence(),
        description: fakerPT_BR.lorem.paragraph(),
        user: fakerPT_BR.internet.email(),
        date: fakerPT_BR.date.anytime(),
      };

      beforeAll(() => {
        findTaskUseCaseMock.byId.mockResolvedValueOnce({ value: task });
      });

      it('should find a task by id successfully', async () => {
        const result = await taskController.findById(taskId);
        expect(result).toEqual(task);
        expect(findTaskUseCaseMock.byId).toHaveBeenCalledWith(taskId);
      });
    });

    describe('failure', () => {
      describe('not found', () => {
        beforeAll(() => {
          findTaskUseCaseMock.byId.mockResolvedValueOnce({
            error: { code: 'COULD_NOT_FIND_TASK', message: 'Task not found' },
          });
        });

        it('should throw NotFoundException when task is not found', async () => {
          await expect(taskController.findById(taskId)).rejects.toThrow(
            NotFoundException,
          );
          expect(exceptionService.notFound).toHaveBeenCalledWith({
            message: 'Task not found',
          });
        });
      });

      describe('internal server error', () => {
        beforeAll(() => {
          findTaskUseCaseMock.byId.mockResolvedValueOnce({
            error: { message: 'Error finding task', code: 'UNEXPECTED' },
          });
        });

        it('should throw InternalServerErrorException when an error occurs', async () => {
          await expect(taskController.findById(taskId)).rejects.toThrow(
            InternalServerErrorException,
          );
          expect(exceptionService.internalServerError).toHaveBeenCalledWith({
            message: 'Error finding task',
          });
        });
      });
    });
  });
});
