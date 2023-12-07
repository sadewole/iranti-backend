import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Cluster } from './cluster.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Note {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ nullable: false })
  @ApiProperty()
  title: string;

  @Column('text')
  @ApiProperty()
  description: string;

  @PrimaryColumn()
  @ApiProperty()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  @ApiProperty()
  clusterId: string;

  @ManyToOne(() => Cluster, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clusterId' })
  @ApiProperty({ type: () => Cluster })
  cluster: Cluster;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
