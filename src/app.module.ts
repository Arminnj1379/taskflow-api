import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './task/task.module';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { NotificationsModule } from './notifications/notifications.module';
import { JwtModule } from '@nestjs/jwt';
import ormConfig from './orm.config';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || '2c11e1c7edab775ca668bb74',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forRoot(ormConfig),
    AuthModule,
    UserModule,
    TaskModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotificationsGateway],
})
export class AppModule {}
