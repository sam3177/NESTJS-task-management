import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Patch,
	Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import CreateTaskDto from './dto/create-task.dto';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import StatusDto from './dto/status.dto';
import Task from './task.entity';

@Controller('tasks')
export class TasksController {
	constructor (private tasksService: TasksService) {}

	// @Get()
	// getTasks (@Query() filterDto: GetTasksFilterDto): Task[] {
	// 	if (Object.keys(filterDto).length) {
	// 		console.log('getting tasks with filter');
	// 		return this.tasksService.getTasksFilter(filterDto);
	// 	} else {
	// 		console.log('getting all tasks');
	// 		return this.tasksService.getTasks();
	// 	}
	// }

	// //first way to get the req.body
	// // @Post()
	// // createTask (@Body()
	// // body: {
	// // 	title: string;
	// // 	description: string;
	// // }): Task {
	// // 	const { title, description } = body;
	// // 	return this.tasksService.createTask(title, description);
	// // }

	//second way to get the req.body

	@Post()
	createTask (@Body() createTaskDto: CreateTaskDto): Promise<Task> {
		return this.tasksService.createTask(createTaskDto);
	}

	@Get(':id')
	getTaskById (@Param('id') id: string): Promise<Task> {
		return this.tasksService.getTaskById(id);
	}

	@Delete(':id')
	deleteTask (@Param('id') id: string): Promise<void> {
		return this.tasksService.deleteTask(id);
	}

	@Patch(':id/status')
	updateTaskStatus (
		@Param('id') id: string,
		@Body() statusDto: StatusDto,
	): Promise<Task> {
		return this.tasksService.updateTaskStatus(id, statusDto.status);
	}
}
