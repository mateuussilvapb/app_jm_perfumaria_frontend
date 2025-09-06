import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-generic-dialog',
  imports: [
    ButtonModule,
  ],
  templateUrl: './generic-dialog.component.html',
  styleUrls: ['./generic-dialog.component.scss'],
})
export class GenericDialogComponent implements OnInit {

  icon: string = '';
  colorTitle: string = '';
  mensagemHtml: string = '';
  severityButton: 'success' | 'warn' | 'danger' = 'warn';
  classTitle: string = 'flex align-items-center px-3 pt-2 text-xl font-bold mb-3';

  @Input() message: string = '';
  @Input() tituloDialog: string = 'Atenção';
  @Input() type: 'error' | 'info' | 'success' = 'info';

  ngOnInit(): void {
    this.message = this.config.data?.message ?? '';
    this.mensagemHtml = this.message.replace(/\n/g, '<br>');
    this.type = this.config.data?.type ?? 'info';
    if (this.config.data?.titulo !== undefined && this.config.data?.titulo !== null && this.config.data?.titulo !== '') {
      this.tituloDialog = this.config.data?.titulo;
      return;
    }
    this.setTituloDialog();
    this.setIcon();
    this.setColorTitle();
    this.setClassesTitle();
    this.setSeverityButton();
  }

  constructor(
    public readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig
  ) {}

  onClose() {
    this.ref.close();
  }

  setTituloDialog() {
    if (this.type === 'success') {
      this.tituloDialog = 'Sucesso';
    } else if (this.type === 'error') {
      this.tituloDialog = 'Erro';
    }
  }

  setIcon() {
    if (this.type === 'success') {
      this.icon = 'pi pi-check-circle';
    } else if (this.type === 'error') {
      this.icon = 'pi pi-times-circle';
    } else {
      this.icon = 'pi pi-info-circle';
    }
  }

  setColorTitle() {
    if (this.type === 'success') {
      this.colorTitle = 'text-green-500';
    } else if (this.type === 'error') {
      this.colorTitle = 'text-red-500';
    } else {
      this.colorTitle = 'text-orange-500';
    }
  }

  setClassesTitle() {
    this.classTitle = `${this.classTitle} ${this.colorTitle}`;
  }

  setSeverityButton() {
    if (this.type === 'success') {
      this.severityButton = 'success';
    } else if (this.type === 'error') {
      this.severityButton = 'danger';
    } else {
      this.severityButton = 'warn';
    }
  }
}
