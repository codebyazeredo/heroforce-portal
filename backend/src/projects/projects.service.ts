import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { User } from '../users/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(createProjectDto: CreateProjectDto): Promise<Project> {
        const { responsibleId, tasks, ...projectData } = createProjectDto;
        const userFound = await this.userRepository.findOneBy({ id: responsibleId });

        if (!userFound) {
            throw new NotFoundException(`Herói com ID ${responsibleId} não encontrado no sistema.`);
        }

        const project = this.projectRepository.create({
            ...projectData,
            responsible: userFound,
            tasks: tasks?.map(t => ({ description: t.description }))
        });

        return await this.projectRepository.save(project);
    }

    async findAll(): Promise<Project[]> {
        return await this.projectRepository.find({
            relations: ['responsible', 'tasks'],
            order: { id: 'DESC' }
        });
    }

    async findOne(id: number): Promise<Project> {
        const project = await this.projectRepository.findOne({
            where: { id },
            relations: ['responsible', 'tasks'],
        });

        if (!project) throw new NotFoundException('Projeto não encontrado');
        return project;
    }

    async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
        const { responsibleId, tasks, ...projectData } = updateProjectDto;
        const project = await this.findOne(id);

        if (responsibleId) {
            const responsible = await this.userRepository.findOneBy({ id: responsibleId });
            if (!responsible) throw new NotFoundException('Novo responsável não encontrado');
            project.responsible = responsible;
        }
        Object.assign(project, projectData);

        return await this.projectRepository.save(project);
    }

    async remove(id: number): Promise<void> {
        const project = await this.findOne(id);
        await this.projectRepository.remove(project);
    }

    private calculateProgress(project: Project): number {
        if (!project.tasks?.length) return 0;

        const completed = project.tasks.filter(t => t.completed).length;
        return Math.round((completed / project.tasks.length) * 100);
    }
}