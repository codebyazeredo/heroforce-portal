import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { UserCharacter } from '../enums/user-character.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'int', enum: UserCharacter, default: UserCharacter.OTHERS })
  character: UserCharacter;

  @Column({ type: 'int', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;
}