import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Patch,
	Query,
	UseGuards,
	Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import CreateTaskDto from './dto/create-task.dto';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import StatusDto from './dto/status.dto';
import Task from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import GetUser from 'src/auth/getUser.decorator';
import User from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
	private logger = new Logger('TasksController');
	constructor (
		private tasksService: TasksService,
	) {}
	@Get()
	getTasks (
		@Query() filterDto: GetTasksFilterDto,
		@GetUser() user: User,
	): Promise<Task[]> {
		this.logger.verbose(
			`User '${user.username}' is getting his tasks!`,
		);
		return this.tasksService.getTasks(filterDto, user);
	}

	@Post()
	createTask (
		@Body() createTaskDto: CreateTaskDto,
		@GetUser() user: User,
	): Promise<Task> {
		return this.tasksService.createTask(createTaskDto, user);
	}
	ggfv;

	@Get(':id')
	getTaskById (
		@Param('id') id: string,
		@GetUser() user: User,
	): Promise<Task> {
		return this.tasksService.getTaskById(id, user);
	}

	@Delete(':id')
	deleteTask (
		@Param('id') id: string,
		@GetUser() user: User,
	): Promise<void> {
		return this.tasksService.deleteTask(id, user);
	}

	@Patch(':id/status')
	updateTaskStatus (
		@Param('id') id: string,
		@Body() statusDto: StatusDto,
		@GetUser() user: User,
	): Promise<Task> {
		return this.tasksService.updateTaskStatus(
			id,
			statusDto.status,
			user,
		);
	}
}
