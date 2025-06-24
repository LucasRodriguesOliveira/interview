import {
  Exclude,
  Expose,
  Transform,
  TransformFnParams,
} from 'class-transformer';
import { TaskModel } from '../../../../domain/model/task';

@Exclude()
export class ListTaskPresenter extends TaskModel {
  @Transform(({ obj }: TransformFnParams) => obj._id)
  @Expose()
  declare id: string;

  @Expose()
  declare title: string;

  @Expose()
  declare description: string;

  @Expose()
  declare date: Date;

  @Expose()
  declare user: string;
}
