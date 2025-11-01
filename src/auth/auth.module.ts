import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module'; // ⬅️ import UserModule

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || '2c11e1c7edab775ca668bb74',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
  exports: [AuthService], // برای استفاده در ماژول‌های دیگر (مثل Tasks)
})
export class AuthModule {}
