export enum ROLES {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
}

export enum ROLES_PT_BR {
  ADMIN = 'Administrador',
  MANAGER = 'Gerente',
  EMPLOYEE = 'Funcionário',
}

export const ALL_ROLES: ROLES[] = [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE];
