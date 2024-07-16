import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { add } from 'date-fns';
import { Note, User } from 'src/entities';
import { RecurTypes } from 'src/entities/note.entity';
import { NotificationService } from 'src/modules/notification/notification.service';
import { QUEUES } from 'src/common/helpers';

@Injectable()
export class ReminderService {
  constructor(
    @InjectQueue(QUEUES.REMINDER.PROCESSOR_NAME) private reminderQueue: Queue,
    private notificationService: NotificationService,
  ) {}

  async scheduleReminderJobs(note: Note, startTime: Date) {
    const now = new Date();
    const currentReminderTime = startTime;

    const delay = currentReminderTime.getTime() - now.getTime();

    await this.reminderQueue.add(
      QUEUES.REMINDER.SEND_REMINDER_JOB,
      { reminderId: note.id, reminderTime: currentReminderTime },
      { delay },
    );
  }

  getNextReminderTime(currentTime: Date, pattern: RecurTypes): Date {
    switch (pattern) {
      case RecurTypes.daily:
        return add(currentTime, { days: 1 });
      case RecurTypes.weekly:
        return add(currentTime, { weeks: 1 });
      case RecurTypes.monthly:
        return add(currentTime, { months: 1 });
      default:
        throw new Error('Invalid recurrence pattern');
    }
  }

  async sendMessage(user: User, message: string) {
    await this.notificationService.sendEmail({
      mailType: 'noteReminder',
      subject: `Note reminder: ${message}`,
      to: [user.email],
    });
  }
}
