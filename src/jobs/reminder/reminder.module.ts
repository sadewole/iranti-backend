import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { BullModule } from '@nestjs/bull';
import { QUEUES } from 'src/common/helpers';
import { ReminderProcessor } from './reminder.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from 'src/entities';
import { NotificationModule } from 'src/modules/notification/notification.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.REMINDER.PROCESSOR_NAME,
    }),
    TypeOrmModule.forFeature([Note]),
    NotificationModule,
  ],
  providers: [ReminderService, ReminderProcessor],
  exports: [ReminderService],
})
export class ReminderModule {}
