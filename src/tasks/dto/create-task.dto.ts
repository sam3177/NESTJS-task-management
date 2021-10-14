import { IsNotEmpty } from 'class-validator';
export default class CreateTaskDto {
	@IsNotEmpty() public title: string;
	@IsNotEmpty() public description: string;
}
