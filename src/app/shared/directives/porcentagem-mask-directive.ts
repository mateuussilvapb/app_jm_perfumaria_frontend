import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  forwardRef,
} from '@angular/core';

@Directive({
  selector: '[appPorcentagemMask]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PorcentagemMaskDirective),
      multi: true,
    },
  ],
})
export class PorcentagemMaskDirective implements ControlValueAccessor {
  @Input() numeroCasasDecimais: number = 2;
  @Input() maxValue: number = 100;

  private valorTexto: string = ''; // Valor puro (ex: '3500')
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private readonly el: ElementRef<HTMLInputElement>) {} // Chamado pelo Angular quando o FormControl faz setValue/patchValue/reset

  writeValue(value: any): void {
    if (value == null || value === '') {
      this.valorTexto = '';
      this.el.nativeElement.value = '';
      return;
    }

    let numericValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(numericValue)) {
      this.valorTexto = '';
      this.el.nativeElement.value = '';
      return;
    }

    // Use Math.round para evitar problemas de precisão com ponto flutuante
    this.valorTexto = Math.round(
      numericValue * 100 * Math.pow(10, this.numeroCasasDecimais - 2)
    ).toString();
    this.formatar(false); // Não notifica o form (onChange) ao carregar o valor inicial
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  // ----------------------------------------------------------------------
  // ✅ 1. HOST LISTENER PRINCIPAL (Desktop e Backspace Controlado)
  // ----------------------------------------------------------------------
  // Mantém sua lógica original de keydown para controle total da digitação e backspace.
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const key = event.key; // Adicionamos teclas de navegação para melhor usabilidade (Home, End, Arrows, Tab)
    const teclasAceitas =
      /^(\d|Backspace|Delete|ArrowLeft|ArrowRight|Tab|Home|End)$/;

    // Permite comandos de Ctrl/Cmd (C, V, X, A, Z) sem intervir
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    if (!teclasAceitas.test(key)) {
      event.preventDefault();
      return;
    }

    // Apenas Backspace e Dígitos alteram this.valorTexto
    if (key === 'Backspace') {
      this.valorTexto = this.valorTexto.slice(0, -1);
    } else if (key.match(/\d/)) {
      // Apenas se for um dígito (evita teclas de navegação)
      this.valorTexto += key;
    } else {
      // Ignora teclas de navegação/controle sem preventDefault para permitir a ação nativa
      return;
    }

    if (+this.valorTexto === 0) {
      this.valorTexto = '';
    }

    this.formatar(true); // Atualiza o visual e o modelo
    event.preventDefault(); // ESSENCIAL: Evita o caracter bruto ser inserido pelo browser
  }

  // ----------------------------------------------------------------------
  // ✅ 2. HOST LISTENER FALLBACK (Mobile e Paste/Autofill)
  // ----------------------------------------------------------------------
  // Captura alterações que não vieram de um keydown controlado (mobile, autofill).
  // Se o `keydown` com `preventDefault` falhar no mobile, o `input` será disparado.
  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const inputElement = this.el.nativeElement;

    // 1. Remove toda a formatação para obter o valor puro (lida com paste e digitação mobile)
    const rawValue = inputElement.value;
    const apenasDigitos = rawValue.replace(/\D/g, '');

    // 2. Se o valor interno de dígitos não mudou, evita reprocessamento (e o cursor não é afetado)
    if (this.valorTexto === apenasDigitos) {
      return;
    }

    this.valorTexto = apenasDigitos;
    this.formatar(true);
    this.onTouched();

    // CORREÇÃO DO CURSOR (opcional, mas melhora muito a UX no mobile)
    // Move o cursor para antes do ' %'
    const position = inputElement.value.length - 2;
    inputElement.setSelectionRange(position, position);
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();

    const pasted = event.clipboardData?.getData('text') ?? '';
    const apenasDigitos = pasted.replace(/\D/g, '');

    if (!apenasDigitos) return;

    this.valorTexto = apenasDigitos;
    this.formatar(true); // Notifica o form
    this.onTouched();
  }

  private formatar(notify: boolean) {
    let valorNumericoFormatado = 0; // Ex: 35.00
    let valorParaModel = 0; // Ex: 0.35

    if (this.valorTexto) {
      valorNumericoFormatado =
        +this.valorTexto / Math.pow(10, this.numeroCasasDecimais);
    } // aplica limite

    if (valorNumericoFormatado > this.maxValue) {
      valorNumericoFormatado = this.maxValue;
      this.valorTexto = (
        this.maxValue * Math.pow(10, this.numeroCasasDecimais)
      ).toFixed(0);
    }

    // Se o valor puro for 0, limpa o campo visualmente, exceto se houver digitos depois da virgula.
    if (!this.valorTexto && this.el.nativeElement.value !== '') {
      this.el.nativeElement.value = '';
    }

    // Se há dígitos, formata
    if (this.valorTexto) {
      const formatado =
        valorNumericoFormatado.toFixed(this.numeroCasasDecimais) + ' %';
      this.el.nativeElement.value = formatado;
    } // Atualiza o FormControl com valor numérico puro (0.35 para 35%)

    valorParaModel = valorNumericoFormatado / 100;

    if (notify) {
      this.onChange(valorParaModel);
      this.onTouched();
    }
  }
}
