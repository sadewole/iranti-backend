import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { BullModule } from '@nestjs/bull';
import { NotificationService } from 'src/modules/notification/notification.service';
import { QUEUES } from 'src/common/helpers';
import { ReminderProcessor } from './reminder.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from 'src/entities';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.REMINDER.PROCESSOR_NAME,
    }),
    TypeOrmModule.forFeature([Note]),
  ],
  providers: [ReminderService, ReminderProcessor, NotificationService],
  exports: [ReminderService],
})
export class ReminderModule {}
