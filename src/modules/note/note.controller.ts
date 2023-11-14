import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Note } from 'src/entities';
import { NoteService } from './note.service';
import { CreateNoteDto } from './note.dto';
import { JwtAuthGuard } from '../auth/guards';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('note')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notes' })
  async getNotes(): Promise<Note[]> {
    return await this.noteService.getNotes();
  }

  @Get()
  @ApiOperation({ summary: 'Get one cluster' })
  async getCluster(id: string) {
    return await this.noteService.getCluster(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  async createNote(@Req() req, @Body() body: CreateNoteDto): Promise<Note> {
    return await this.noteService.createNote(body, req.user);
  }
}
