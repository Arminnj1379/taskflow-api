import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { comparePassword } from './utils';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'ورود کاربر و دریافت توکن JWT' })
  @ApiBody({
    type: AuthCredentialsDto,
    examples: {
      default: {
        value: { username: 'user', password: '123456' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'توکن با موفقیت صادر شد.',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'اعتبارنامه نامعتبر.' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() credentials: AuthCredentialsDto) {
    const { username, password } = credentials;

    if (!username || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.authService.generateToken(user);
    return { access_token: token };
  }
}
