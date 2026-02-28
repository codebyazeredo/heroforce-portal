export enum ProjectStatusType {
  PLANNING = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  CRITICAL = 3,
}

export const ProjectStatusTypeLabel: Record<ProjectStatusType, string> = {
  [ProjectStatusType.PLANNING]: 'Planejamento',
  [ProjectStatusType.IN_PROGRESS]: 'Em Progresso',
  [ProjectStatusType.COMPLETED]: 'Concluído',
  [ProjectStatusType.CRITICAL]: 'Crítico'
};