export enum ProjectStatusType {
  PLANNING = 0,
  IN_PROGRESS = 1,
  DONE = 2,
  CANCELED = 3
}

export const ProjectStatusTypeLabel: Record<ProjectStatusType, string> = {
  [ProjectStatusType.PLANNING]: 'Planejamento',
  [ProjectStatusType.IN_PROGRESS]: 'Em Progresso',
  [ProjectStatusType.DONE]: 'Concluído',
  [ProjectStatusType.CANCELED]: 'Cancelado'
};