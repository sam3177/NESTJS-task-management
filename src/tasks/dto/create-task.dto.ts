import { IsNotEmpty } from 'class-validator';
export default class CreateTaskDto {
	@IsNotEmpty() public title: string;
	@IsNotEmpty() public description: string;

	constructor (t: string, d: string) {
		this.title = t;
		this.description = d;
	}
}
