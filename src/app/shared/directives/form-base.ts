//Angular
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Directive, OnInit } from '@angular/core';

//Internos
import { ROTAS_FORM } from '@shared/enums/rotas-form.enum';

@Directive()
export abstract class FormBase implements OnInit {
  public form: FormGroup;

  protected id: string | null = null;

  public isView = false;
  public isUpdate = false;
  public isCreate = false;

  constructor(protected readonly activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.identificarTipoRota();
    this.afterIdentificarTipoRota();
    this.obterIdDaRota();
    this.afterObterIdDaRota();
    this.buildForm();
    this.afterBuildForm();
    this.tratarCamposForm();
    this.afterFormInit();
  }

  /**
   * Método abstrato para forçar os filhos a implementarem o form.
   */
  protected abstract buildForm(): void;

  /**
   * Hook opcional: executado após a criação do form.
   */
  protected afterBuildForm() {}

  /**
   * Hook opcional: executado após o tratamento do form.
   */
  protected afterFormInit(): void {}

  /**
   * Identifica o tipo de ação baseado na rota.
   */
  protected identificarTipoRota(): void {
    const path = this.activatedRoute.snapshot.routeConfig?.path ?? '';

    this.isView = path.includes(ROTAS_FORM.VISUALIZAR);
    this.isUpdate = path.includes(ROTAS_FORM.EDITAR);
    this.isCreate = path.includes(ROTAS_FORM.ADICIONAR);
  }

  /**
   * Hook opcional: executado após a identificação do tipo da aba.
   */
  protected afterIdentificarTipoRota() {}

  /**
   * Desabilita os campos se estiver em modo de visualização.
   */
  protected tratarCamposForm(): void {
    if (this.isView && this.form) {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.disable({ emitEvent: false });
      });
    }
  }

  /**
   * Recupera o id presente na rota, caso informado.
   */
  protected obterIdDaRota(): void {
    const param = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = param ?? null;
  }

  /**
   * Hook opcional: executado após a captura do id da rota.
   */
  protected afterObterIdDaRota() {}

  /**
   * Helper: true se o form estiver em modo leitura
   */
  public get isReadOnly(): boolean {
    return this.isView;
  }

  /**
   * Helper: true se o form estiver em modo edição ou criação
   */
  public get isEditable(): boolean {
    return this.isUpdate || this.isCreate;
  }
}
