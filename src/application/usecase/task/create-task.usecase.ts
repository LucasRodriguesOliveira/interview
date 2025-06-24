import { TaskModel } from '../../../domain/model/task';
import { ITaskRepository } from '../../../domain/repository/task.interface';
import { ICryptoService } from '../../../domain/service/crypto.interface';
import { ILoggerService } from '../../../domain/service/logger.interface';
import { ErrorResponse } from '../../../domain/types/application/error/error.response';
import { Result } from '../../../domain/types/application/result';

export class CreateTaskUsecase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly cryptoService: ICryptoService,
    private readonly loggerService: ILoggerService,
  ) {}

  public async run(
    taskData: Partial<TaskModel>,
  ): Promise<Result<TaskModel, ErrorResponse>> {
    try {
      const encryptedUser = this.cryptoService.encrypt(taskData.user!);

      const taskCreated = await this.taskRepository.create({
        ...taskData,
        user: encryptedUser,
      });

      this.loggerService.log(
        CreateTaskUsecase.name,
        `Task [${taskCreated.id}] created!`,
      );

      /**
       * Uncomment the line below if you prefer authenticity over speed.
       * Since the user email is still available as a parameter, reversing (decrypting)
       * the value is not strictly necessary, as you can rely on the original input.
       * However, if ensuring data authenticity is a concern (e.g., validating that
       * the stored value matches what was encrypted), you may choose to decrypt it.
       */
      // taskCreated.user = this.cryptoService.decrypt(taskCreated.user);

      // comment the line below if you uncommented the above
      taskCreated.user = taskData.user!;

      return {
        value: taskCreated,
      };
    } catch (error) {
      const log = {
        message: 'Task could not be created',
        params: taskData,
        error,
      };

      this.loggerService.error(CreateTaskUsecase.name, JSON.stringify(log));

      return {
        error: {
          code: 'COULD_NOT_CREATE_TASK',
          message: log.message,
        },
      };
    }
  }
}
