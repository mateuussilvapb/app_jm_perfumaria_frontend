import { Pipe, PipeTransform } from '@angular/core';
import { STATUS } from '@shared/enums/status.enum';

@Pipe({
  name: 'status',
})
export class StatusPipe implements PipeTransform {
  transform(value: STATUS, ...args: unknown[]): unknown {
    if (value === STATUS.ATIVO) {
      return 'Ativo';
    }
    return 'Inativo';
  }
}
