import { TaskModel } from '../../../domain/model/task';
import { ITaskRepository } from '../../../domain/repository/task.interface';
import { ICryptoService } from '../../../domain/service/crypto.interface';
import { ILoggerService } from '../../../domain/service/logger.interface';
import { ErrorResponse } from '../../../domain/types/application/error/error.response';
import { Result } from '../../../domain/types/application/result';

export class FindTaskUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly cryptoService: ICryptoService,
    private readonly loggerService: ILoggerService,
  ) {}

  public async byId(taskId: string): Promise<Result<TaskModel, ErrorResponse>> {
    try {
      const task = await this.taskRepository.findOne(taskId);

      if (!task) {
        const message = `Task [${taskId}] does not exist.`;
        this.loggerService.warn(FindTaskUseCase.name, message);

        return {
          error: {
            code: 'COULD_NOT_FIND_TASK',
            message,
          },
        };
      }

      task.user = this.cryptoService.decrypt(task.user);

      this.loggerService.log(FindTaskUseCase.name, `Task [${task.id}] found.`);

      return {
        value: task,
      };
    } catch (error) {
      const log = {
        message: 'Task could not be found',
        params: { taskId },
        error,
      };

      this.loggerService.error(FindTaskUseCase.name, JSON.stringify(log));

      return {
        error: {
          code: 'COULD_NOT_FIND_TASK',
          message: log.message,
        },
      }
    }
  }
}
