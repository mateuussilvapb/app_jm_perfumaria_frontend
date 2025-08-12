//Angular
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

//Externos
import Keycloak from 'keycloak-js';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

//Internos
import { AlterarSenhaDto } from '@usuario/interfaces/alterar-senha';
import { CustomValidators } from '@shared/validators/custom-validators';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { UsuarioCommandService } from '@usuario/service/usuario-command.service';
import { FormControlErrorsComponent } from '@shared/components/form-control-errors/form-control-errors.component';

@Component({
  selector: 'app-dialog-alterar-senha',
  imports: [
    //Angular
    FormsModule,
    CommonModule,
    ReactiveFormsModule,

    //Externos
    DialogModule,
    ButtonModule,
    PasswordModule,

    //Internos
    LoadingComponent,
    FormControlErrorsComponent,
  ],
  templateUrl: './dialog-alterar-senha.component.html',
  styleUrls: ['./dialog-alterar-senha.component.scss'],
})
export class DialogAlterarSenhaComponent implements OnInit {
  form: FormGroup;
  private readonly keycloak = inject(Keycloak);
  public readonly whileChangePassword$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly fb: FormBuilder,
    private readonly ref: DynamicDialogRef,
    private readonly messageService: MessageService,
    private readonly usuarioCommandService: UsuarioCommandService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      currentPassword: [null, [Validators.required]],
      newPassword: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          CustomValidators.lettersAndNumbersPasswordValidator(),
        ],
      ],
      confirmNewPassword: [null, [Validators.required]],
    });
  }

  getControlCurrentPassword(): FormControl {
    return this.form.get('currentPassword') as FormControl;
  }

  getControlNewPassword(): FormControl {
    return this.form.get('newPassword') as FormControl;
  }

  getControlConfirmPassword(): FormControl {
    return this.form.get('confirmNewPassword') as FormControl;
  }

  senhasValidas() {
    if (
      this.getControlNewPassword().value !=
      this.getControlConfirmPassword().value
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção!',
        detail: `As senhas informadas nos campos 'Nova Senha' e 'Confirmar Nova Senha' não coincidem.`,
        life: 5000,
      });
      return false;
    }
    return true;
  }

  onSubmit(event) {
    if (this.senhasValidas()) {
      this.whileChangePassword$.next(true);
      const dto: AlterarSenhaDto = {
        currentPassword: this.form.value.currentPassword,
        newPassword: this.form.value.newPassword,
      };
      this.usuarioCommandService.alterarSenha(dto).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Senha alterada com sucesso! Você será redirecionado para a tela de login. Aguarde...`,
            life: 5000,
          });
          setTimeout(() => this.keycloak.logout(), 5000);
        },
        error: () => {
          this.whileChangePassword$.next(false);
        },
      });
    }
  }

  onVoltar() {
    this.ref.close();
  }
}
