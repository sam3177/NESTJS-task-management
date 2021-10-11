import { TaskStatus } from '../task-status.enum';
import { IsEnum } from 'class-validator';
export default class StatusDto {
	@IsEnum(TaskStatus) status: TaskStatus;
}
