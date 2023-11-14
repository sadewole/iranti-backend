import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cluster, Note, User } from 'src/entities';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './note.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note) private noteRepository: Repository<Note>,
    @InjectRepository(Cluster) private clusterRepository: Repository<Cluster>,
  ) {}

  async getNotes() {
    return await this.noteRepository.find();
  }

  async getCluster(id: string) {
    const cluster = await this.clusterRepository.findOne({
      where: { id },
      order: { createdAt: 'DESC' },
      relations: ['user', 'notes', 'collaborators'],
    });
    // if (!cluster) {
    //   throw new NotFoundException('Request not found');
    // }

    return cluster;
  }

  async createNote(body: CreateNoteDto, user: User) {
    if (body.clusterId) {
      await this.getCluster(body.clusterId);
      //   if (!existCluster) {
      //     throw new NotFoundException('Invalid cluster identifier');
      //   }
    }

    return this.noteRepository.save({
      ...body,
      userId: user.id,
    });
  }
}
