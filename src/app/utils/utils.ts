//Internos
import { STATUS } from '@shared/enums/status.enum';
import { ROLES, ROLES_PT_BR } from '@shared/models/roles';

export class Utils {
  static readonly getStatusNormalized = (status: STATUS) => {
    if (status === STATUS.ATIVO) {
      return 'Ativo';
    }
    return 'Inativo';
  };

  static readonly getStatusUsuarioNormalized = (status: boolean) => {
    if (status) {
      return 'Ativo';
    }
    return 'Inativo';
  };

  static readonly isEmpty = (arr: any[]): boolean =>
    arr == null || arr.length === 0;

  static readonly mapRolesPtBr: Record<ROLES, ROLES_PT_BR> = {
    [ROLES.ADMIN]: ROLES_PT_BR.ADMIN,
    [ROLES.MANAGER]: ROLES_PT_BR.MANAGER,
    [ROLES.EMPLOYEE]: ROLES_PT_BR.EMPLOYEE,
  };

  static readonly searchParamsToString = (
    filters?: URLSearchParams
  ): string => {
    if (!filters) return '';
    return `?${filters.toString()}`;
  };
}
