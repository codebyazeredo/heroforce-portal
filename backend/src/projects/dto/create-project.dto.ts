import { IsString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsArray, ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '../enums/project-status.enum';
import { CreateTaskDto } from './create-project-task-dto';
import { CreateProjectGoalsDto } from './create-project-goals.dto';

export class CreateProjectDto {
  @ApiProperty({ example: 'Nome do Projeto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Descrição do Projeto' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: ProjectStatus, default: ProjectStatus.PLANNING })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status: ProjectStatus;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  responsibleId: number;

  @ApiProperty({ type: CreateProjectGoalsDto })
  @ValidateNested()
  @Type(() => CreateProjectGoalsDto)
  goals: CreateProjectGoalsDto;

  @ApiProperty({ type: [CreateTaskDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  tasks: CreateTaskDto[];
}