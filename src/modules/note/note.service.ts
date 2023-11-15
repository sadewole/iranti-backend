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
    const clusters = await this.clusterRepository.find({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
      relations: {
        collaborators: true,
        notes: true,
      },
    });

    // Transform collaborators to include only necessary property
    const results = clusters.map((cls) => {
      const collaborators = cls.collaborators.map(this.transformCollaborator);

      return { ...cls, collaborators };
    });

    return results;
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

    const { user, collaborators, ...rest } = cluster;

    // Transform collaborators to include only necessary property
    const transformedCollabs = collaborators.map(this.transformCollaborator);

    return {
      ...rest,
      collaborators: transformedCollabs,
      owner: {
        id: user.id,
        email: user.email,
      },
    };
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

  transformCollaborator(user: User) {
    return {
      id: user.id,
      email: user.email,
      joinedDate: user.createdAt,
    };
  }
}
