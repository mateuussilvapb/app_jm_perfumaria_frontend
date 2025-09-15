//Internos
import { STATUS } from '@shared/enums/status.enum';
import { SITUACAO } from '@shared/enums/situacao.enum';
import { ROLES, ROLES_PT_BR } from '@shared/models/roles';

export class Utils {
  static readonly getStatusNormalized = (status: STATUS) => {
    if (status === STATUS.ATIVO) return 'Ativo';
    return 'Inativo';
  };

  static readonly getStatusUsuarioNormalized = (status: boolean) => {
    if (status) return 'Ativo';
    return 'Inativo';
  };

  static readonly getSituacaoNormalized = (situacao: SITUACAO) => {
    if (situacao === SITUACAO.CADASTRO_FINALIZADO) return 'Finalizado';
    return 'Em cadastramento';
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

  static readonly getSearchParamsFromObj = (obj: Object): URLSearchParams => {
    const params = new URLSearchParams;
    if (obj) {
      Object.keys(obj).forEach(key => {
        if (this.canAddValueOnParams(obj[key])) {
          params.append(key, obj[key]);
        }
      })
    }
    return params
  }

  private static readonly canAddValueOnParams = (value: any): boolean => {
    if (value != null && value != undefined && value != '') {
      return true;
    }
    return false;
  }

  static readonly formatarLocalDate = (date: Date | null): string | null => {
    if (!date) return null;
    return date.toISOString().split("T")[0];
  }
}
