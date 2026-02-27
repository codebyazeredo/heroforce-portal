import { Column } from 'typeorm';

export class ProjectGoals {
  @Column({ default: 0 })
  agility: number;

  @Column({ default: 0 })
  enchantment: number;

  @Column({ default: 0 })
  efficiency: number;

  @Column({ default: 0 })
  excellence: number;

  @Column({ default: 0 })
  transparency: number;

  @Column({ default: 0 })
  ambition: number;
}