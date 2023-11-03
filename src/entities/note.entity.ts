import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Cluster } from './cluster.entity';

@Entity()
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: false })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ nullable: false })
  clusterId: string;

  @ManyToOne(() => Cluster)
  @JoinColumn()
  cluster: Cluster;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
