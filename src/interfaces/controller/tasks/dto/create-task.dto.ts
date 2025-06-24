import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
    example: 'Lorem Ipsum',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    example: 'Some good description...',
  })
  description: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }: TransformFnParams) => new Date(value))
  @ApiProperty({
    type: Date,
    required: false,
    example: new Date(),
  })
  date: Date;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @MinLength(3)
  @ApiProperty({
    type: String,
    required: true,
    minLength: 3,
    example: 'lorem@ipsum.com',
  })
  userEmail: string;
}
