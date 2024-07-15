import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { NotificationModule } from 'src/modules/notification/notification.module';

@Module({
  imports: [NotificationModule],
  providers: [ReminderService],
  exports: [ReminderService],
})
export class ReminderModule {}
