import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cluster, Note, User } from 'src/entities';
import { ReminderModule } from 'src/jobs/reminder/reminder.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note, Cluster, User]), ReminderModule],
  providers: [NoteService],
  controllers: [NoteController],
})
export class NoteModule {}
