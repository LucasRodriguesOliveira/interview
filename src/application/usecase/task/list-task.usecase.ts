import { TaskModel } from '../../../domain/model/task';
import { ITaskRepository } from '../../../domain/repository/task.interface';
import { ICryptoService } from '../../../domain/service/crypto.interface';
import { ILoggerService } from '../../../domain/service/logger.interface';
import { ErrorResponse } from '../../../domain/types/application/error/error.response';
import { Result } from '../../../domain/types/application/result';

export class ListTaskUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly cryptoService: ICryptoService,
    private readonly loggerService: ILoggerService,
  ) {}

  public async run(): Promise<Result<TaskModel[], ErrorResponse>> {
    try {
      const taskList = await this.taskRepository.findAll();

      taskList.forEach((task) => {
        task.user = this.cryptoService.decrypt(task.user);
      });

      this.loggerService.log(
        ListTaskUseCase.name,
        `Listing [${taskList.length}] tasks`,
      );

      return {
        value: taskList,
      };
    } catch (error) {
      const log = {
        message: 'Could not get a list of tasks',
        params: null,
        error: error as Error,
      };

      this.loggerService.error(ListTaskUseCase.name, JSON.stringify(log));

      return {
        error: {
          code: 'UNEXPECTED',
          message: log.message,
        },
      };
    }
  }
}
