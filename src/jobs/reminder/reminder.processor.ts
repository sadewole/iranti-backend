import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { ReminderService } from './reminder.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from 'src/entities';
import { QUEUES } from 'src/common/helpers';

@Processor(QUEUES.REMINDER.PROCESSOR_NAME)
export class ReminderProcessor {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    private readonly reminderService: ReminderService,
  ) {}

  @Process(QUEUES.REMINDER.SEND_REMINDER_JOB)
  async handleSendReminder(job: Job) {
    const { reminderId, reminderTime } = job.data;
    const reminder = await this.noteRepository.findOne({
      where: { id: reminderId },
      relations: {
        user: true,
      },
    });

    if (reminder) {
      this.reminderService.sendMessage(reminder.user, reminder.title);
      // Schedule the next occurrence of the reminder
      const nextReminderTime = this.reminderService.getNextReminderTime(
        new Date(reminderTime),
        reminder.recurrencePattern,
      );
      if (nextReminderTime) {
        await this.reminderService.scheduleReminderJobs(
          reminder,
          nextReminderTime,
        );
      }
    }
  }
}
