import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cluster, Note } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Note, Cluster])],
  providers: [NoteService],
  controllers: [NoteController],
})
export class NoteModule {}
