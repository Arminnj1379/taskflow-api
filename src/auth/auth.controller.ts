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
import { hashPassword, comparePassword } from './utils';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'ثبت‌نام کاربر جدید' })
  @ApiBody({
    type: AuthCredentialsDto,
    examples: {
      default: {
        value: { email: 'user@example.com', password: '123456' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'کاربر با موفقیت ثبت‌نام شد.' })
  @ApiResponse({ status: 400, description: 'اطلاعات نامعتبر یا کاربر تکراری.' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() credentials: AuthCredentialsDto) {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await hashPassword(password);
    await this.userService.create(email, hashedPassword);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  @ApiOperation({ summary: 'ورود کاربر و دریافت توکن JWT' })
  @ApiBody({
    type: AuthCredentialsDto,
    examples: {
      default: {
        value: { email: 'user@example.com', password: '123456' },
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
    const { email, password } = credentials;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.userService.findByEmail(email);
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
