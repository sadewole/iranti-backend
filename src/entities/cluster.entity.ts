import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Note } from './note.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Cluster {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ nullable: false })
  @ApiProperty()
  name: string;

  @Column('text')
  @ApiProperty()
  description: string;

  @Column({ nullable: false })
  @ApiProperty()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToMany(() => User, (cp) => cp.collabClusters)
  @JoinTable()
  @ApiProperty({ type: [User] })
  collaborators: User[];

  @OneToMany(() => Note, (cp) => cp.cluster)
  @ApiProperty({ type: [Note] })
  notes: Note[];

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
