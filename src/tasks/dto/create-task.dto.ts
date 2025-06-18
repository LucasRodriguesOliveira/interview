import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsEmail()
  userMail: string;
}
