export enum UserRole {
  USER = 0,
  ADMIN = 99,
}

export const UserRoleLabel: Record<UserRole, string> = {
  [UserRole.USER]: "Herói",
  [UserRole.ADMIN]: "Administrador",
};