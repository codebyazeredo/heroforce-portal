import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    character: string; // Ex: Homem de Ferro, Batman

    @Column({ default: 'hero' }) // 'hero' ou 'admin'
    role: string;

    @CreateDateColumn()
    createdAt: Date;
}
