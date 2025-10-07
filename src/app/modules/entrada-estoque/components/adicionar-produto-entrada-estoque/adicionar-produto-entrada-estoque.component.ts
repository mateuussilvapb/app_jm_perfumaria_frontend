//Angular
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

//Externos
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { CurrencyMaskModule } from 'ng2-currency-mask';

//Internos
import { STATUS } from '@shared/enums/status.enum';
import { FormBase } from '@shared/directives/form-base';
import { OPTIONS_CURRENCY_MASK } from '@utils/constants';
import { ROTAS_FORM } from '@shared/enums/rotas-form.enum';
import { AutocompleteDto } from '@shared/interfaces/autocomplete-dto';
import { PorcentagemMaskDirective } from '@shared/directives/porcentagem-mask-directive';
import { GenericPopOverComponent } from '@shared/components/generic-pop-over/generic-pop-over.component';
import { FormControlErrorsComponent } from '@shared/components/form-control-errors/form-control-errors.component';

@Component({
  selector: 'app-adicionar-produto-entrada-estoque',
  imports: [
    //Angular
    FormsModule,
    CommonModule,
    CurrencyMaskModule,
    ReactiveFormsModule,

    //Externo
    CardModule,
    SelectModule,
    ButtonModule,
    TooltipModule,
    InputTextModule,
    InputMaskModule,

    //Interno
    GenericPopOverComponent,
    PorcentagemMaskDirective,
    FormControlErrorsComponent,
  ],
  templateUrl: './adicionar-produto-entrada-estoque.component.html',
})
export class AdicionarProdutoEntradaEstoqueComponent extends FormBase implements OnInit, OnChanges {
  @ViewChild(GenericPopOverComponent)
  genericPopOverComponent!: GenericPopOverComponent;

  @Input({required: true}) produtosOptions: AutocompleteDto[] = [];
  @Input({required: true}) produtoToEdit: any = null;

  @Output() adicionarProduto = new EventEmitter<any>();

  public optionsCurrencyMask = OPTIONS_CURRENCY_MASK;

  constructor(
    private readonly fb: FormBuilder,
    protected override readonly router: Router,
    protected override readonly location: Location,
    public override readonly activatedRoute: ActivatedRoute,
  ) {
    super(router, location, '/', activatedRoute);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['produtoToEdit'] && this.produtoToEdit) {
      this.form.patchValue(this.produtoToEdit);
    }
  }

  buildForm() {
    this.form = this.fb.group({
      idProduto: [null, Validators.required],
      precoUnitario: [null, [Validators.required, Validators.min(0.01)]],
      quantidade: [null, [Validators.required, Validators.min(1)]],
      status: [STATUS.ATIVO, Validators.required],
      desconto: [null],
    });
  }

  onAdicionarProduto() {
    if (this.form.valid) {
      this.adicionarProduto.emit(this.form.getRawValue());
      this.form.reset();
      this.form.get('status')?.setValue(STATUS.ATIVO);
      this.produtoToEdit = null;
    }
  }

  onMouseEnterProduto(event: any) {
    this.genericPopOverComponent.showBtnAction = true;
    this.genericPopOverComponent.labelBtn = 'Adicionar Produto';
    this.genericPopOverComponent.acao = () => this.router.navigate([`/produto/${ROTAS_FORM.ADICIONAR}`]);
    this.genericPopOverComponent.mensagem = 'Caso queira adicionar um novo produto, clique no botão abaixo.'

    this.genericPopOverComponent.show(event);
  }

  onMouseLeavePopOver() {
    this.genericPopOverComponent.hide();
  }
}
