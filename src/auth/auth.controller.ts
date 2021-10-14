import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthCredentialsDto from './dto/auth-credentials.dto';
import JwtToken from './jwt.token.interface';

@Controller('auth')
export class AuthController {
	constructor (private authService: AuthService) {}
	@Post('signup')
	signUp (
		@Body() authCredentialsDto: AuthCredentialsDto,
	): Promise<void> {
		return this.authService.signUp(authCredentialsDto);
	}
	@Post('signin')
	signIn (
		@Body() authCredentialsDto: AuthCredentialsDto,
	): Promise<JwtToken> {
		return this.authService.signIn(authCredentialsDto);
	}
}
