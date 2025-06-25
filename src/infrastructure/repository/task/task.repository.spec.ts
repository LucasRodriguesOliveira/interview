import { Model } from 'mongoose';
import { TaskRepository } from './task.repository';
import { Task } from '../../database/mongodb/schema/tasks.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker/.';
import { CreateTaskPresenter } from './presenter/create-task.presenter';
import { plainToInstance } from 'class-transformer';
import { ListTaskPresenter } from './presenter/list-task.presenter';
import { FindTaskPresenter } from './presenter/find-task.presenter';

const taskModelMock = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
};

describe(TaskRepository.name, () => {
  let taskRepository: TaskRepository;
  let taskModel: jest.Mocked<Model<Task>>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        TaskRepository,
        {
          provide: getModelToken(Task.name),
          useValue: taskModelMock,
        },
      ],
    }).compile();

    taskRepository = app.get<TaskRepository>(TaskRepository);
    taskModel = app.get(getModelToken(Task.name));
  });

  it('should be defined', () => {
    expect(taskRepository).toBeDefined();
  });

  describe('create', () => {
    const taskData = {
      _id: faker.database.mongodbObjectId(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      date: faker.date.anytime(),
      user: faker.internet.email(),
    };

    const taskCreated: CreateTaskPresenter = {
      id: taskData._id,
      title: taskData.title,
      description: taskData.description,
      date: taskData.date,
      user: taskData.user,
    };

    beforeAll(() => {
      taskModel.create.mockResolvedValueOnce({
        toObject: jest.fn().mockReturnValueOnce(taskData),
      } as any);
    });

    it('should create a task', async () => {
      const result = await taskRepository.create(taskData);

      expect(result).toEqual(taskCreated);
      expect(taskModel.create).toHaveBeenCalledWith(taskData);
    });
  });

  describe('findAll', () => {
    const taskData = {
      _id: faker.database.mongodbObjectId(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      date: faker.date.anytime(),
      user: faker.internet.email(),
    };

    const tasks = [taskData];
    const expectedTasks = tasks.map((task) =>
      plainToInstance(ListTaskPresenter, task),
    );

    beforeAll(() => {
      taskModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(
          tasks.map((task) => ({
            toObject: jest.fn().mockReturnValueOnce(task),
          })),
        ),
      } as any);
    });

    it('should return all tasks', async () => {
      const result = await taskRepository.findAll();

      expect(result).toEqual(expectedTasks);
      expect(taskModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const taskId = faker.database.mongodbObjectId();
    const taskData = {
      _id: taskId,
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      date: faker.date.anytime(),
      user: faker.internet.email(),
    };

    const expectedTask = plainToInstance(FindTaskPresenter, taskData);

    beforeAll(() => {
      taskModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({
          toObject: jest.fn().mockReturnValueOnce(taskData),
        }),
      } as any);
    });

    it('should return a task by id', async () => {
      const result = await taskRepository.findOne(taskId);

      expect(result).toEqual(expectedTask);
      expect(taskModel.findById).toHaveBeenCalledWith(taskId);
    });
  });
});
