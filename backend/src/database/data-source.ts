import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { ProjectTask } from '../projects/entities/projects-tasks.entity';
import { User } from '../users/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Project, ProjectTask],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: false,
});