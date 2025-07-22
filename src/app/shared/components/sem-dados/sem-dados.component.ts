import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'sem-dados',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (showMessagem()) {
    <div class="text-center">
      <p>Não existem dados a serem apresentados...</p>
    </div>
    }
  `,
})
export class SemDadosComponent {
  @Input() public data: any;

  public showMessagem(): boolean {
    return (
      this.data === null ||
      this.data === undefined ||
      (Array.isArray(this.data) && this.data.length == 0)
    );
  }
}
