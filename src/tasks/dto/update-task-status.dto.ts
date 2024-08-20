import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class UpdateTastStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
