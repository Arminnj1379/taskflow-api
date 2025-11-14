import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Req,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { TaskStatus } from './task.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../user/user.entity';
import type { Request } from 'express';
import { CreateTaskDto } from './dto/create-task.dto';

interface AuthRequest extends Request {
  user: User;
}

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'ایجاد تسک جدید' })
  @ApiBody({
    type: CreateTaskDto,
    examples: {
      default: {
        value: { title: 'testtask', description: 'This is a Test :))' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'تسک با موفقیت ایجاد شد.' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(
    @Body() createTaskDto: CreateTaskDto, // ⬅️ کل بدنه رو یک‌جا بگیر
    @Req() req: AuthRequest,
  ) {
    const { title, description } = createTaskDto;
    const user = req.user;
    return this.taskService.createTask(user, title, description);
  }

  @Get()
  @ApiOperation({ summary: 'دریافت تمام تسک‌های کاربر' })
  @ApiResponse({ status: 200, description: 'لیست تسک‌ها.' })
  async findAll(@Req() req: AuthRequest) {
    const user = req.user;
    return this.taskService.findAllTasks(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت تسک با id' })
  @ApiResponse({ status: 200, description: 'لیست تسک‌ها.' })
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthRequest,
  ) {
    const user = req.user;
    return this.taskService.findOneTask(id, user);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'تغییر وضعیت تسک' })
  @ApiResponse({ status: 200, description: 'وضعیت تسک به‌روزرسانی شد.' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: TaskStatus,
    @Req() req: AuthRequest,
  ) {
    const user = req.user;
    return this.taskService.updateTaskStatus(id, status, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف تسک' })
  @ApiResponse({ status: 200, description: 'تسک حذف شد.' })
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: AuthRequest) {
    const user = req.user;
    await this.taskService.deleteTask(id, user);
    return { message: 'Task deleted successfully' };
  }

  @Get('test-error')
  @ApiOperation({ summary: 'دریافت تمام تسک‌های کاربر' })
  @ApiResponse({ status: 200, description: 'لیست تسک‌ها.' })
  testError() {
    throw new BadRequestException('This is a test error');
  }
}
