import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cluster, Note, User } from 'src/entities';
import { Repository } from 'typeorm';
import { CreateClusterDto, CreateNoteDto } from './note.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note) private noteRepository: Repository<Note>,
    @InjectRepository(Cluster) private clusterRepository: Repository<Cluster>,
  ) {}

  async getNotes() {
    return await this.noteRepository.find({
      order: { createdAt: 'DESC' },
      relations: {
        cluster: true,
      },
    });
  }

  async getUserClusters(user: User) {
    return await this.clusterRepository.findOne({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
      relations: {
        collaborators: true,
        notes: true,
      },
    });
  }

  async createCluster(body: CreateClusterDto, user: User) {
    return await this.clusterRepository.save({
      ...body,
      userId: user.id,
    });
  }

  async getCluster(id: string) {
    const cluster = await this.clusterRepository.findOne({
      where: { id },
      order: { createdAt: 'DESC' },
      relations: {
        user: true,
        notes: true,
        collaborators: true,
      },
    });
    if (!cluster) {
      throw new NotFoundException('Cluster does not exist');
    }
    return cluster;
  }

  async createNote(body: CreateNoteDto, user: User): Promise<Note> {
    body.clusterId = body.clusterId.trim() || null;
    if (body.clusterId) {
      await this.getCluster(body.clusterId);
    }

    return await this.noteRepository.save({
      ...body,
      userId: user.id,
    });
  }
}
