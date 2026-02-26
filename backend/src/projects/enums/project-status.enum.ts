export enum ProjectStatus {
  PLANNING = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  CRITICAL = 3,
}

export const ProjectStatusLabel: Record<ProjectStatus, string> = {
  [ProjectStatus.PLANNING]: "Planejamento",
  [ProjectStatus.IN_PROGRESS]: "Em Andamento",
  [ProjectStatus.COMPLETED]: "Concluído",
  [ProjectStatus.CRITICAL]: "Crítico",
};