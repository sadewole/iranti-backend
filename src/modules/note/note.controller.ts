import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Cluster, Note } from 'src/entities';
import { NoteService } from './note.service';
import { CreateClusterDto, CreateNoteDto, UpdateClusterDto } from './note.dto';
import { JwtAuthGuard, VerifiedUserGuard } from '../auth/guards';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsEmailDto } from '../auth/auth.dto';

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

  @Get('cluster/mine')
  @ApiResponse({ status: 200, description: 'All notes.', type: [Cluster] })
  @ApiOperation({ summary: 'fetch all my clusters' })
  async getUserClusters(@Req() req) {
    return await this.noteService.getUserClusters(req.user);
  }

  @Get('cluster/:id')
  @ApiOperation({ summary: 'Get one cluster' })
  async getCluster(@Param('id') id: string) {
    return await this.noteService.getCluster(id);
  }

  @Put('cluster/:id')
  @ApiOperation({ summary: 'update cluster' })
  async updateCluster(
    @Req() req,
    @Param('id') id: string,
    @Body() body: UpdateClusterDto,
  ) {
    return await this.noteService.updateCluster(id, req.user, body);
  }

  @Post('cluster/:id/collab')
  @ApiOperation({ summary: 'Add collaborators to cluster' })
  async addCollabCluster(
    @Req() req,
    @Param('id') id: string,
    @Body() body: IsEmailDto,
  ) {
    return await this.noteService.addCollabCluster(id, req.user, body);
  }

  @Delete('cluster/:id/collab/:collabId')
  @ApiOperation({ summary: 'Delete collaborator from cluster' })
  async deleteCollabCluster(
    @Param('id') id: string,
    @Param('collabId') collabId: string,
  ) {
    return await this.noteService.deleteCollaborator(id, collabId);
  }

  @Post('cluster')
  @ApiOperation({ summary: 'Create new cluster' })
  async createCluster(@Body() body: CreateClusterDto, @Req() req) {
    return await this.noteService.createCluster(body, req.user);
  }
}
