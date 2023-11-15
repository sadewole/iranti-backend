import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Note } from 'src/entities';
import { NoteService } from './note.service';
import { CreateClusterDto, CreateNoteDto } from './note.dto';
import { JwtAuthGuard, VerifiedUserGuard } from '../auth/guards';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('note')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, VerifiedUserGuard)
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'All notes.', type: [Note] })
  @ApiOperation({ summary: 'Get all notes' })
  async getNotes(): Promise<Note[]> {
    return await this.noteService.getNotes();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  async createNote(@Req() req, @Body() body: CreateNoteDto): Promise<Note> {
    return await this.noteService.createNote(body, req.user);
  }

  //   @Get('clusters')
  //   @ApiOperation({ summary: 'Get all cluster' })
  //   async getClusters() {
  //     return await this.noteService.getClusters();
  //   }

  @Get('cluster/mine')
  @ApiOperation({ summary: 'fetch all my clusters' })
  async getUserClusters(@Req() req) {
    return await this.noteService.getUserClusters(req.user);
  }

  @Get('cluster/:id')
  @ApiOperation({ summary: 'Get one cluster' })
  async getCluster(@Param('id') id: string) {
    return await this.noteService.getCluster(id);
  }

  @Get('cluster')
  @ApiOperation({ summary: 'Create new cluster' })
  async createCluster(@Body() body: CreateClusterDto, @Req() req) {
    return await this.noteService.createCluster(body, req.user);
  }
}
