import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskProxy } from '../../../infrastructure/proxy/tasks/create-task.proxy';
import { CreateTaskDto } from './dto/create-task.dto';
import { PresenterInterceptor } from '../../../infrastructure/common/interceptor/presenter.interceptor';
import { TaskModel } from '../../../domain/model/task';
import { HttpExceptionService } from '../../../infrastructure/exception/http-exception.service';
import { FindTaskProxy } from '../../../infrastructure/proxy/tasks/find-task.proxy';
import { ListTaskProxy } from '../../../infrastructure/proxy/tasks/list-task.proxy';
import { TaskPresenter } from './presenter/task.presenter';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateTaskUsecase } from '../../../application/usecase/task/create-task.usecase';
import { FindTaskUseCase } from '../../../application/usecase/task/find-task.usecase';
import { ListTaskUseCase } from '../../../application/usecase/task/list-task.usecase';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('task')
@UseInterceptors(new PresenterInterceptor(TaskPresenter, { entity: 'task' }))
export class TaskController {
  constructor(
    @Inject(CreateTaskProxy.Token)
    private readonly createTaskUseCase: CreateTaskUsecase,
    @Inject(FindTaskProxy.Token)
    private readonly findTaskUseCase: FindTaskUseCase,
    @Inject(ListTaskProxy.Token)
    private readonly listTaskUseCase: ListTaskUseCase,
    private readonly exceptionService: HttpExceptionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: TaskPresenter,
  })
  @ApiBadRequestResponse()
  public async create(
    @Body(ValidationPipe) createTaskDto: CreateTaskDto,
  ): Promise<TaskModel> {
    const result = await this.createTaskUseCase.run({
      ...createTaskDto,
      user: createTaskDto.userEmail,
    });

    if (result?.error) {
      this.exceptionService.badRequest({ message: result.error.message });
    }

    return result.value;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor)
  @ApiOkResponse({
    type: TaskPresenter,
  })
  @ApiInternalServerErrorResponse()
  public async list(): Promise<TaskModel[]> {
    const result = await this.listTaskUseCase.run();

    if (result?.error) {
      this.exceptionService.internalServerError({
        message: result.error.message,
      });
    }

    return result.value;
  }

  @Get(':taskId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: TaskPresenter,
  })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  public async findById(@Param('taskId') taskId: string): Promise<TaskModel> {
    const result = await this.findTaskUseCase.byId(taskId);

    if (result.error) {
      const { code, message } = result.error;

      if (code === 'COULD_NOT_FIND_TASK') {
        this.exceptionService.notFound({ message });
      }

      this.exceptionService.internalServerError({ message });
    }

    return result.value;
  }
}
