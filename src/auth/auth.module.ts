import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import JwtStrategy from './jwt.strategy';
import UserRepository from './users.repository';

@Module({
	imports: [
		ConfigModule,
		TypeOrmModule.forFeature([ UserRepository ]),
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => { 
			return {
				secret: configService.get('JWT_SECRET'),
				signOptions: {
					expiresIn: +configService.get('JWT_EXPIRE'),
				},
			}
		}})
	],
	controllers: [ AuthController ],
	providers: [ AuthService, JwtStrategy,ConfigService ],
	exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
