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

  mensagemHtml: string = '';
  dialogStyleClass: string = '';
  iconClass: string = 'mt-2 text-base';
  titleClass: string = 'mb-0 mt-2 text-base';
  severityButton: 'success' | 'warn' | 'danger' = 'warn';

  @Input() message: string = '';
  @Input() dialogTitle: string = 'Atenção';
  @Input() type: 'error' | 'info' | 'success' = 'info';

  ngOnInit(): void {
    this.message = this.config.data?.message ?? '';
    this.mensagemHtml = this.message.replace(/\n/g, '<br>');
    this.type = this.config.data?.type ?? 'info';
    if (this.config.data?.titulo !== undefined && this.config.data?.titulo !== null && this.config.data?.titulo !== '') {
      this.dialogTitle = this.config.data?.titulo;
      return;
    }

    this.setIconClass();
    this.setTitleClass();
    this.setDialogTitle();
    this.setSeverityButton();
    this.setDialogStyleClass();
  }

  constructor(
    public readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig
  ) {}

  onClose() {
    this.ref.close();
  }

  setIconClass() {
    if (this.type === 'success') {
      this.iconClass += ' pi pi-check-circle text-green-500';
    } else if (this.type === 'error') {
      this.iconClass += ' pi pi-times-circle text-red-500';
    } else {
      this.iconClass += ' pi pi-info-circle text-orange-500';
    }
  }

  setTitleClass() {
    if (this.type === 'success') {
      this.titleClass += ' text-green-500';
    } else if (this.type === 'error') {
      this.titleClass += ' text-red-500';
    } else {
      this.titleClass += ' text-orange-500';
    }
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

  setDialogTitle() {
    if (this.type === 'success') {
      this.dialogTitle = 'Sucesso';
    } else if (this.type === 'error') {
      this.dialogTitle = 'Erro';
    }
  }

  setDialogStyleClass() {
    if (this.type === 'success') {
      this.dialogStyleClass = 'dialog-success';
    } else if (this.type === 'error') {
      this.dialogStyleClass = 'dialog-error';
    } else {
      this.dialogStyleClass = 'dialog-warn';
    }
  }

}
