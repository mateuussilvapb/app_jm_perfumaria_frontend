import { NgControl } from "@angular/forms";
import { Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from "@angular/core";

@Directive({
  selector: '[appPorcentagemMask]',
})
export class PorcentagemMaskDirective implements OnChanges {

  @Input() numeroCasasDecimais: number = 2;
  @Input() maxValue: number = 100;

  private valorTexto: string = '';

  constructor(
    private readonly ngControl: NgControl,
    private readonly el: ElementRef<HTMLInputElement>
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['numeroCasasDecimais']) {
      this.formatar();
    }
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
      valorNumerico = +this.valorTexto / (100 * Math.pow(10, this.numeroCasasDecimais));
    }

    // aplica limite
    if (valorNumerico * 100 > this.maxValue) {
      valorNumerico = this.maxValue / 100; // volta para decimal
      this.valorTexto = (this.maxValue * Math.pow(10, this.numeroCasasDecimais)).toString();
    }

    const formatado = (valorNumerico * 100).toFixed(this.numeroCasasDecimais) + ' %';
    this.el.nativeElement.value = formatado;

    // Atualiza o formControl com o valor numérico (0.15 = 15%)
    if (this.ngControl?.control) {
      this.ngControl.control.setValue(formatado, { emitEvent: true });
    }
  }
}

