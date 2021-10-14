import {
	createParamDecorator,
	ExecutionContext,
} from '@nestjs/common';

const GetUser = createParamDecorator(
	(_data, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest();
		return request.user;
	},
);
export default GetUser;
