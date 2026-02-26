import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProjectStatus } from '../enums/project-status.enum';
import { ProjectTask } from './projects-tasks.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.PLANNING })
  status: ProjectStatus;

  @OneToMany(() => ProjectTask, (task) => task.project, { cascade: true })
  tasks: ProjectTask[];

  @ManyToOne(() => User, { eager: true }) 
  @JoinColumn({ name: 'responsible_id' })
  responsible: User
}