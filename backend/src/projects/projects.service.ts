import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { User } from '../users/entities/user.entity';
import { ProjectTask } from './entities/projects-tasks.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserRole } from 'src/users/enums/user-role.enum';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(ProjectTask)
    private readonly taskRepository: Repository<ProjectTask>,
  ) { }

  async create(dto: CreateProjectDto): Promise<Project> {
    const { responsibleId, tasks, goals, ...projectData } = dto;
    const user = await this.userRepository.findOneBy({ id: responsibleId });

    if (!user) {
      throw new NotFoundException(
        `Herói com ID ${responsibleId} não encontrado.`,
      );
    }

    this.validateGoals(goals);

    const project = this.projectRepository.create({
      ...projectData,
      goals,
      responsible: user,
      tasks: tasks?.map((t) =>
        this.taskRepository.create({ description: t.description }),
      ),
    });

    return await this.projectRepository.save(project);
  }

  async findAll(currentUser: any): Promise<Project[]> {
    const isAdmin = currentUser.role === UserRole.ADMIN;

    const findOptions: any = {
      relations: ['responsible', 'tasks'],
      order: { id: 'DESC' },
    };

    if (!isAdmin) {
      findOptions.where = {
        responsible: { id: currentUser.id }
      };
    }

    return this.projectRepository.find(findOptions);
  }

  async findOne(id: number, currentUser?: any): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['responsible', 'tasks'],
    });

    if (!project) throw new NotFoundException('Projeto não encontrado');

    if (currentUser && currentUser.role !== UserRole.ADMIN && project.responsible?.id !== currentUser.id) {
      throw new BadRequestException('Você não tem permissão para acessar este projeto.');
    }

    return project;
  }

  async update(id: number, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    const { responsibleId, tasks, goals, ...projectData } = dto;

    if (responsibleId !== undefined) {
      const responsible = await this.userRepository.findOneBy({
        id: responsibleId,
      });
      if (!responsible)
        throw new NotFoundException('Novo responsável não encontrado');

      project.responsible = responsible;
    }

    if (goals) {
      this.validateGoals(goals);
      project.goals = { ...project.goals, ...goals };
    }

    Object.assign(project, projectData);

    if (tasks) {
      await this.taskRepository.delete({ project: { id } });

      project.tasks = tasks.map((t) =>
        this.taskRepository.create({
          description: t.description,
          project,
        }),
      );
    }

    return await this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }

  private validateGoals(goals: any) {
    if (!goals) return;

    const total =
      goals.agility +
      goals.enchantment +
      goals.efficiency +
      goals.excellence +
      goals.transparency +
      goals.ambition;

    if (total > 100) {
      throw new BadRequestException(
        'Total de pontos das metas não pode ultrapassar 100',
      );
    }
  }
}