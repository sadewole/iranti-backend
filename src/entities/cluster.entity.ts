import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ClusterCollaborator } from './cluster_collaborator.entity';
import { Note } from './note.entity';

@Entity()
export class Cluster {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column('text')
  description: string;

  @Column({ nullable: false })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => ClusterCollaborator, (cp) => cp.cluster)
  collaborators: ClusterCollaborator[];

  @OneToMany(() => Note, (cp) => cp.cluster)
  notes: Note[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
