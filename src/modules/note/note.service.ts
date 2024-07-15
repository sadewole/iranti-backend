import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cluster, Note, User } from 'src/entities';
import { Repository } from 'typeorm';
import {
  CreateClusterDto,
  CreateNoteDto,
  UpdateClusterDto,
  UpdateNoteDto,
} from './note.dto';
import { IsEmailDto } from '../auth/auth.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note) private noteRepository: Repository<Note>,
    @InjectRepository(Cluster) private clusterRepository: Repository<Cluster>,
    @InjectRepository(User) private userRepository: Repository<User>,
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

    return clusters;
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
    return {
      ...rest,
      collaborators,
      owner: user,
    };
  }

  async getClusterByOwner(id: string, user: User) {
    const cluster = await this.clusterRepository.findOne({
      where: { id, userId: user.id },
      relations: {
        user: true,
        notes: true,
        collaborators: true,
      },
    });
    if (!cluster) {
      throw new NotFoundException(
        'Cluster either not found or does not belong to you.',
      );
    }

    const { user: owner, collaborators, ...rest } = cluster;
    return {
      ...rest,
      collaborators,
      owner,
    };
  }

  async updateCluster(id: string, user: User, body: UpdateClusterDto) {
    const cluster = await this.getClusterByOwner(id, user);
    return await this.clusterRepository.save({ ...cluster, ...body });
  }

  async deleteCluster(id: string, user: User) {
    await this.getClusterByOwner(id, user);
    await this.clusterRepository.delete({ id });
    return { message: 'Cluster deleted successfully' };
  }

  async addCollabCluster(id: string, user: User, body: IsEmailDto) {
    const cluster = await this.getClusterByOwner(id, user);
    if (body.email.toLowerCase() === user.email.toLowerCase()) {
      throw new BadRequestException('You already own this cluster.');
    }

    const collab = await this.userRepository.findOneBy({ email: body.email });

    cluster.collaborators = [...cluster.collaborators, collab];

    return await this.clusterRepository.save(cluster);
  }

  async deleteCollaborator(id: string, collabId: string) {
    const cluster = await this.getCluster(id);

    cluster.collaborators = cluster.collaborators.filter(
      (collab) => collab.id === collabId,
    );
    await this.clusterRepository.save(cluster);

    return { message: 'Deleted sucessfully' };
  }

  async createNote(body: CreateNoteDto, user: User): Promise<Note> {
    if (body.clusterId) {
      await this.getCluster(body.clusterId);
    }

    return await this.noteRepository.save({
      ...body,
      userId: user.id,
    });
  }

  async getNote(id: string, user: User) {
    const note = await this.noteRepository.findOne({
      where: { id, userId: user.id },
      relations: {
        cluster: true,
        user: true,
      },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  async updateNote(id: string, user: User, body: UpdateNoteDto) {
    await this.noteRepository.update({ id, userId: user.id }, body);
    return await this.getNote(id, user);
  }

  async deleteNote(id: string, user: User) {
    await this.getNote(id, user);
    await this.noteRepository.delete({ id });
    return { message: 'Note deleted successfully' };
  }
}
