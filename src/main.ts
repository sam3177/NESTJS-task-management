import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap (){
	const logger = new Logger();
	const PORT = process.env.PORT;
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new TransformInterceptor());
	await app.listen(PORT);
	logger.log(`App started on port ${PORT}!`);
}
bootstrap();
