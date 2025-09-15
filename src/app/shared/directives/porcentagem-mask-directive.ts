import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Directive, ElementRef, HostListener, Input, forwardRef } from "@angular/core";

@Directive({
  selector: '[appPorcentagemMask]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PorcentagemMaskDirective),
      multi: true
    }
  ]
})
export class PorcentagemMaskDirective implements ControlValueAccessor {

  @Input() numeroCasasDecimais: number = 2;
  @Input() maxValue: number = 100;

  private valorTexto: string = '';
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private readonly el: ElementRef<HTMLInputElement>) {}

  // Chamado pelo Angular quando o FormControl faz setValue/patchValue/reset
  writeValue(value: any): void {
    if (value == null || value === '') {
      this.valorTexto = '';
      this.el.nativeElement.value = '';
      return;
    }

    // Se vier algo (ex.: número ou string formatada), normaliza e formata
    let numericValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(numericValue)) {
      this.valorTexto = '';
      this.el.nativeElement.value = '';
      return;
    }

    this.valorTexto = (numericValue * Math.pow(10, this.numeroCasasDecimais)).toString();
    this.formatar();
  }

  // 👉 chamado pelo Angular para registrar mudanças (model → view)
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // 👉 chamado pelo Angular para registrar quando o campo foi tocado
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // 👉 opcional: chamado pelo Angular se o campo for desabilitado
  setDisabledState?(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const key = event.key;
    const teclasAceitas = /^(\d|Backspace)$/;

    if (!teclasAceitas.test(key)) {
      event.preventDefault();
      return;
    }

    if (key === 'Backspace') {
      this.valorTexto = this.valorTexto.slice(0, -1);
    } else {
      this.valorTexto += key;
    }

    if (+this.valorTexto === 0) {
      this.valorTexto = '';
    }

    this.formatar();
    event.preventDefault(); // evita o caracter bruto
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();

    const pasted = event.clipboardData?.getData('text') ?? '';
    const apenasDigitos = pasted.replace(/\D/g, '');

    if (!apenasDigitos) return;

    this.valorTexto = apenasDigitos;
    this.formatar();
  }

  private formatar() {
    let valorNumerico = 0;

    if (this.valorTexto) {
      valorNumerico = +this.valorTexto / Math.pow(10, this.numeroCasasDecimais);
    }

    // aplica limite
    if (valorNumerico > this.maxValue) {
      valorNumerico = this.maxValue;
      this.valorTexto = (this.maxValue * Math.pow(10, this.numeroCasasDecimais)).toString();
    }

    const formatado = valorNumerico.toFixed(this.numeroCasasDecimais) + ' %';
    this.el.nativeElement.value = formatado;

    // 🔥 Atualiza o FormControl com valor numérico puro (0.35 = 35%)
    this.onChange(valorNumerico / 100); // ou `valorNumerico`, se quiser guardar 35 ao invés de 0.35
    this.onTouched();
  }
}
