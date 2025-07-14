import { STATUS } from '@shared/enums/status.enum';

export const getStatusNormalized = (status: STATUS) => {
  if (status === STATUS.ATIVO) {
    return 'Ativo';
  }
  return 'Inativo';
};
