import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { RolesGuard } from 'src/auth/decorators/roles.guard';
import { ProjectService } from './projects.service';
import { Project } from './entities/project.entity';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  
  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Admin cria projeto com metas' })
  create(@Body() dto: CreateProjectDto): Promise<Project> {
    return this.projectService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualiza um projeto existente' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjectDto, ): Promise<Project> {
    return this.projectService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Exclui um projeto' })
  async remove(@Param('id', ParseIntPipe) id: number,): Promise<{ message: string }> {
    await this.projectService.remove(id);
    return { message: 'Projeto removido com sucesso' };
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os projetos' })
  findAll(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um projeto por ID' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Project> {
    return this.projectService.findOne(id);
  }
}