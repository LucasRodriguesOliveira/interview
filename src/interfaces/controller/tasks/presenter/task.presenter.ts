import { Exclude, Expose } from 'class-transformer';
import { TaskModel } from '../../../../domain/model/task';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class TaskPresenter extends TaskModel {
  @Expose()
  @ApiProperty({
    type: String,
    required: true,
    example: '123ABC123',
  })
  declare id: string;

  @Expose()
  @ApiProperty({
    type: String,
    required: true,
    example: 'Lorem Ipsum',
  })
  declare title: string;

  @Expose()
  @ApiProperty({
    type: String,
    required: true,
    example: 'Some good description',
  })
  declare description: string;

  @Expose()
  @ApiProperty({
    type: String,
    required: true,
    example: new Date(),
  })
  declare date: Date;

  @Expose()
  @ApiProperty({
    type: String,
    required: true,
    example: 'lorem@ipsum.com',
  })
  declare user: string;
}
