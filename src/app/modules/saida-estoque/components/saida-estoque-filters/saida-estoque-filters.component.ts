//Angular
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

//Externos
import { CardModule } from 'primeng/card';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { BehaviorSubject, finalize, forkJoin, map, Observable, startWith } from 'rxjs';


//Internos
import { SITUACAO } from '@shared/enums/situacao.enum';
import { AutocompleteDto } from '@shared/interfaces/autocomplete-dto';
import { MarcaQueryService } from '@marca/service/marca-query.service';
import { ProdutoQueryService } from '@produto/service/produto-query.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { CategoriaQueryService } from '@categoria/service/categoria-query.service';
import { MovimentacaoEstoqueFilterDto } from '@shared/interfaces/movimentacao-estoque-filter-dto';
import { FormControlErrorsComponent } from '@shared/components/form-control-errors/form-control-errors.component';

@Component({
  selector: 'app-saida-estoque-filters',
  imports: [
    //Angular
    FormsModule,
    CommonModule,
    ReactiveFormsModule,

    //Externos
    CardModule,
    ButtonModule,
    SliderModule,
    InputTextModule,
    DatePickerModule,
    RadioButtonModule,
    MultiSelectModule,

    //Internos
    LoadingComponent,
    FormControlErrorsComponent,

  ],
  templateUrl: './saida-estoque-filters.component.html',
})
export class SaidaEstoqueFiltersComponent implements OnInit {
  @Input() refresh$: BehaviorSubject<void>;
  @Output() filter = new EventEmitter<any>();

  public readonly loadingAutocompleteMarcas$ = new BehaviorSubject<boolean>(false);
  public readonly loadingAutocompleteProdutos$ = new BehaviorSubject<boolean>(false);
  public readonly loadingAutocompleteCategorias$ = new BehaviorSubject<boolean>(false);

  public form: FormGroup;
  public maxDate: Date | undefined;
  public marcasOptions: AutocompleteDto[] = [];
  public produtosOptions: AutocompleteDto[] = [];
  public categoriasOptions: AutocompleteDto[] = [];
  public situacaoSelect: { key: string; value: string }[] = [
    { key: SITUACAO.EM_CADASTRAMENTO, value: 'Em Cadastramento' },
    { key: SITUACAO.CADASTRO_FINALIZADO, value: 'Finalizado' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly marcaQueryService: MarcaQueryService,
    private readonly produtoQueryService: ProdutoQueryService,
    private readonly categoriaQueryService: CategoriaQueryService,
  ) {}

  ngOnInit() {
    this.createForm();
    this.getAllAutocompletes();
    this.refreshSubscribe();
    this.definirDataMaxima();
  }

  createForm() {
    this.form = this.fb.group({
      produtos: [null],
      marcas: [null],
      categorias: [null],
      situacao: [null],
      descricao: [null],
      datas: [null],
      descontos: [null],
    });
  }

  refreshSubscribe() {
    this.refresh$
      .pipe(
        startWith(undefined),
        map(() => {
          this.form.reset();
          this.filter.emit();
        })
      ).subscribe();
  }

  getAllAutocompletes() {
    forkJoin([
      this.getAllMarcasAutocomplete(),
      this.getAllProdutosAutocomplete(),
      this.getAllCategoriasAutocomplete()
    ]).subscribe(([marcas, produtos, categorias]) => {
      this.marcasOptions = marcas;
      this.produtosOptions = produtos;
      this.categoriasOptions = categorias;
    })
  }

  getAllProdutosAutocomplete(): Observable<Array<AutocompleteDto>> {
    this.loadingAutocompleteProdutos$.next(true);
    return this.produtoQueryService
      .getAllAutocomplete()
      .pipe(finalize(() => this.loadingAutocompleteProdutos$.next(false)));
  }

  getAllMarcasAutocomplete(): Observable<Array<AutocompleteDto>> {
    this.loadingAutocompleteMarcas$.next(true);
    return this.marcaQueryService
      .getAllAutocomplete()
      .pipe(finalize(() => this.loadingAutocompleteMarcas$.next(false)));
  }

  getAllCategoriasAutocomplete(): Observable<Array<AutocompleteDto>> {
    this.loadingAutocompleteCategorias$.next(true);
    return this.categoriaQueryService
      .getAllAutocomplete()
      .pipe(finalize(() => this.loadingAutocompleteCategorias$.next(false)));
  }

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && control.touched;
  }

  onSubmit() {
    const dto = new MovimentacaoEstoqueFilterDto(this.form.value);
    this.filter.emit(dto);
  }

  limparCampos() {
    this.form.reset();
    this.filter.emit();
  }

  disableButtonBuscar() {
    let disable = true;
    Object.keys(this.form.controls).forEach((controlName) => {
      if (this.form.get(controlName)?.value && this.form.get(controlName)?.value != '') {
        disable = false;
      }
    });
    return disable;
  }

  getControlForm(controlName: string) {
    const control = this.form.controls[controlName] as FormControl;
    if (control) return control;

    console.error(`Controle de formulário "${controlName}" não existe`);
    return new FormControl;
  }

  definirDataMaxima() {
    this.maxDate = new Date();
  }

  get descontoMin() {
    const controlDescontos = this.controlDescontos.value;
    if (controlDescontos) {
      return controlDescontos[0] ?? '-';
    }
    return '-';
  }

  get descontoMax() {
    const controlDescontos = this.controlDescontos.value;
    if (controlDescontos) {
      return controlDescontos[1] ?? '-';
    }
    return '-';
  }

  private get controlDescontos() {
    return this.form.get('descontos') as FormControl ?? null;
  }
}
