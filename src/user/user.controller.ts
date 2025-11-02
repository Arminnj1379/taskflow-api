import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { hashPassword } from '../auth/utils'; // فرض می‌کنیم utils.ts در auth هست

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'ثبت‌نام کاربر جدید' })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      default: {
        value: {
          email: 'user@example.com',
          password: '123456',
          name: 'John',
          lastname: 'Doe',
          username: 'johndoe',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'کاربر با موفقیت ثبت‌نام شد.' })
  @ApiResponse({ status: 400, description: 'اطلاعات نامعتبر یا کاربر تکراری.' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() credentials: CreateUserDto) {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await hashPassword(password);
    await this.userService.create(
      credentials.email,
      hashedPassword,
      credentials.name,
      credentials.lastname,
      credentials.username,
    );
    return { message: 'User registered successfully' };
  }
  @Get('getAllUsers')
  @ApiOperation({ summary: 'دریافت تمام کاربران' })
  @ApiResponse({ status: 200, description: 'اطلاعات کاربر.' })
  @ApiResponse({ status: 404, description: 'هیچ کاربری ثبت نشده است!' })
  async getAll() {
    const users = await this.userService.getAllUsers();
    return users;
  }

  @Get('countAllUsers')
  @ApiOperation({ summary: 'شمارش تمام کاربران' })
  @ApiResponse({ status: 200, description: 'تعداد کاربران.' })
  async countAll() {
    const count = await this.userService.countAllUsers();
    return { count };
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت اطلاعات کاربر با شناسه' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'اطلاعات کاربر.' })
  @ApiResponse({ status: 404, description: 'کاربر یافت نشد.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { id: user.id, email: user.email };
  }

  @Put(':id/password')
  @ApiOperation({ summary: 'تغییر رمز عبور کاربر' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({ status: 200, description: 'رمز عبور با موفقیت تغییر کرد.' })
  @ApiResponse({ status: 404, description: 'کاربر یافت نشد.' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const { newPassword } = updatePasswordDto;
    const hashedPassword = await hashPassword(newPassword);
    const updatedUser = await this.userService.updatePassword(
      id,
      hashedPassword,
    );
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return { message: 'Password updated successfully' };
  }
}
