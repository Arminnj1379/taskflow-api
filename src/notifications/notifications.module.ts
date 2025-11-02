import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [NotificationsGateway, JwtService],
  exports: [NotificationsGateway],
})
export class NotificationsModule {}
