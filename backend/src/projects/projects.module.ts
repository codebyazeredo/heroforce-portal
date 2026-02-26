import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './projects.service';

import { Project } from './entities/project.entity';
import { User } from '../users/entities/user.entity';
import { ProjectController } from './projects.controller';
import { ProjectTask } from './entities/projects-tasks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectTask, User])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}