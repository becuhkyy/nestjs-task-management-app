import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task.model';

export class UpdateTastStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
