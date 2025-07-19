import { Directive } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ROTAS_FORM } from '@shared/enums/rotas-form.enum';

@Directive()
export class FormBase {
  public isView: boolean = false;
  public isUpdate: boolean = false;
  public isCreate: boolean = false;

  constructor(public readonly activatedRoute: ActivatedRoute) {}

  identificarTipoRota() {
    const path = this.activatedRoute.snapshot.routeConfig?.path;
    if (path.includes(ROTAS_FORM.VISUALIZAR)) {
      this.isView = true;
    } else if (path.includes(ROTAS_FORM.EDITAR)) {
      this.isUpdate = true;
    } else if (path.includes(ROTAS_FORM.ADICIONAR)) {
      this.isCreate = true;
    }
  }
}
