//Angular
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

//Externos
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { CurrencyMaskModule } from 'ng2-currency-mask';

//Internos
import { OPTIONS_CURRENCY_MASK } from '@utils/constants';
import { AutocompleteDto } from '@shared/interfaces/autocomplete-dto';
import { PorcentagemMaskDirective } from '@shared/directives/porcentagem-mask-directive';
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
    SelectModule,
    ButtonModule,
    TooltipModule,
    InputTextModule,
    InputMaskModule,

    //Interno
    PorcentagemMaskDirective,
    FormControlErrorsComponent,
  ],
  templateUrl: './adicionar-produto-entrada-estoque.component.html',
})
export class AdicionarProdutoEntradaEstoqueComponent  {
  @Input({ required: true }) formProdutoEntradaEstoque!: FormGroup;
  @Input({ required: true }) produtosAutocomplete!: AutocompleteDto[];
  @Input({ required: true }) isView: boolean = false;
  @Input({ required: true }) isCreate: boolean = false;
  @Input({ required: true }) isEditable: boolean = false;
  @Input({ required: true }) podeRemoverProduto: boolean = false;

  @Output() removeProduto = new EventEmitter<void>();

  public optionsCurrencyMask = OPTIONS_CURRENCY_MASK;

  getControlForm(controlName: string) {
    const control = this.formProdutoEntradaEstoque.controls[controlName] as FormControl;
    if (control) {
      return control;
    }
    console.error(`Controle de formulário "${controlName}" não existe`);
    return new FormControl;
  }
}
