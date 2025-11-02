// src/notifications/notifications.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service'; // فرض بر این است که این سرویس وجود دارد

@WebSocketGateway({
  cors: {
    origin: '*', // در محیط production محدود کنید
  },
})
@Injectable()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // 🔐 استخراج توکن از handshake headers (نه از URL!)
      const authHeader = client.handshake.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        this.logger.warn('Missing or invalid auth header');
        client.disconnect(true);
        return;
      }

      const token = authHeader.substring(7); // حذف 'Bearer '
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // ✅ اطلاعات کاربر را از دیتابیس بخوانید (اختیاری ولی توصیه‌شده)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const user = await this.userService.findById(payload.sub);
      if (!user) {
        client.disconnect(true);
        return;
      }

      // ذخیره userId در client برای استفادهٔ بعدی
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      client.data.user = user;

      this.logger.log(`User ${user.id} connected via WebSocket`);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error('WebSocket auth failed', error.stack);
      client.disconnect(true);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDisconnect(client: Socket) {
    this.logger.log('Client disconnected');
  }

  // مثال: ارسال اعلان به یک کاربر خاص
  notifyUser(userId: number, event: string, data: any) {
    // در عمل، ممکن است نیاز باشد client را بر اساس userId پیدا کنید
    // (با نگهداری map از userId به socketId)
    this.server.emit(event, data); // برای سادگی: broadcast عمومی
    // در پیاده‌سازی واقعی، بهتر است فقط به کاربر مربوطه ارسال شود.
  }
}
