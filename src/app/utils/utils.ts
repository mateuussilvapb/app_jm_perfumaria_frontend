import { STATUS } from '@shared/enums/status.enum';

export class Utils {
  static readonly getStatusNormalized = (status: STATUS) => {
    if (status === STATUS.ATIVO) {
      return 'Ativo';
    }
    return 'Inativo';
  };

  static readonly isEmpty = (arr: any[]): boolean =>
    arr == null || arr.length === 0;
}
