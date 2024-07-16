import {
  Processor,
  Process,
  OnQueueWaiting,
  OnQueueProgress,
  OnQueueCompleted,
  OnQueueFailed,
} from '@nestjs/bull';
import { Job } from 'bull';
import { ReminderService } from './reminder.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from 'src/entities';
import { QUEUES } from 'src/common/helpers';
import { Logger } from '@nestjs/common';

@Processor(QUEUES.REMINDER.PROCESSOR_NAME)
export class ReminderProcessor {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    private readonly reminderService: ReminderService,
  ) {}

  private logger = new Logger(ReminderProcessor.name);

  @OnQueueWaiting()
  onWaiting(job: Job) {
    this.logger.log(`Waiting job ${job.id} of type ${job.name}...`);
  }

  @OnQueueProgress()
  onProgess(job: Job, progress: number) {
    this.logger.debug(
      `InProgress job ${job.id} of type ${job.name}. Progress: ${progress}`,
    );
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: unknown) {
    this.logger.debug(
      `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(
        result,
      )}`,
    );
  }

  @OnQueueFailed()
  onFailed(job: Job<unknown>, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
    throw new Error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
    );
  }

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
      if (reminder.recurrencePattern) {
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
}
