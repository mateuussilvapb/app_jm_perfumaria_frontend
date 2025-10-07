//Angular
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

//Internos
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { BehaviorSubject, finalize } from 'rxjs';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';

//Externos
import { Utils } from '@utils/utils';
import { ROLES } from '@shared/models/roles';
import { FormBase } from '@shared/directives/form-base';
import { CustomValidators } from '@shared/validators/custom-validators';
import { UsuarioCreateDto } from '@usuario/interfaces/usuario-create-dto';
import { UsuarioUpdateDto } from '@usuario/interfaces/usuario-update-dto';
import { UsuarioQueryService } from '@usuario/service/usuario-query.service';
import { UsuarioResponseDto } from '@usuario/interfaces/usuario-response-dto';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { UsuarioCommandService } from '@usuario/service/usuario-command.service';
import { FormControlErrorsComponent } from '@shared/components/form-control-errors/form-control-errors.component';

@Component({
  selector: 'app-usuario-form',
  imports: [
    //Angular
    FormsModule,
    CommonModule,
    ReactiveFormsModule,

    //Externos
    TagModule,
    CardModule,
    ButtonModule,
    PasswordModule,
    InputTextModule,
    MultiSelectModule,

    //Internos
    LoadingComponent,
    FormControlErrorsComponent,
  ],
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss'],
})
export class UsuarioFormComponent extends FormBase implements OnInit {
  public titleCard: string = '';
  public responseUsuario: UsuarioResponseDto;

  public readonly loading$ = new BehaviorSubject<boolean>(false);
  public readonly onCreateUpdate$ = new BehaviorSubject<boolean>(false);

  roles: { name: string; id: ROLES }[] = [
    { name: Utils.mapRolesPtBr[ROLES.ADMIN], id: ROLES.ADMIN },
    { name: Utils.mapRolesPtBr[ROLES.MANAGER], id: ROLES.MANAGER },
    { name: Utils.mapRolesPtBr[ROLES.EMPLOYEE], id: ROLES.EMPLOYEE },
  ];

  constructor(
    private readonly fb: FormBuilder,
    protected override readonly router: Router,
    protected override readonly location: Location,
    private readonly messageService: MessageService,
    public override readonly activatedRoute: ActivatedRoute,
    private readonly usuarioQueryService: UsuarioQueryService,
    private readonly usuarioCommandService: UsuarioCommandService
  ) {
    super(router, location, '/usuario', activatedRoute);
  }

  buildForm() {
    this.form = this.fb.group({
      username: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          CustomValidators.noSpacesAndSpecialCharacters(),
        ],
      ],
      email: [null, [Validators.required, Validators.email]],
      firstName: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      lastName: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      password: [
        null,
        this.isCreate
          ? [
              Validators.required,
              Validators.minLength(8),
              CustomValidators.lettersAndNumbersPasswordValidator(),
            ]
          : [],
      ],
      roles: [null, [Validators.required]],
    });
  }

  protected override afterIdentificarTipoRota(): void {
    this.setTitleCard();
    this.updateFormControls(true);
  }

  setTitleCard() {
    if (this.isView) {
      this.titleCard = 'Visualizar Usuário';
    } else if (this.isUpdate) {
      this.titleCard = 'Editar Usuário';
    } else if (this.isCreate) {
      this.titleCard = 'Criar Usuário';
    }
  }

  protected override afterObterIdDaRota(): void {
    if (this.isView || this.isUpdate) {
      this.getData();
    }
  }

  protected override afterFormInit(): void {
    this.disableLabelsOnLoading();
  }

  getData() {
    this.loading$.next(true);
    this.usuarioQueryService
      .byID(this.id)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe((res) => {
        this.responseUsuario = res;
        this.patchValueOnForm(res);
      });
  }

  patchValueOnForm(res: UsuarioResponseDto) {
    this.form.patchValue({
      username: res.username,
      email: res.email,
      firstName: res.firstName,
      lastName: res.lastName,
      password: null,
      roles: this.roles.filter((role) => res.roles.includes(role.id)),
    });
  }

  onSubmit(event) {
    if (this.form.valid) {
      this.onCreateUpdate$.next(true);
      event.preventDefault();
      let subscribe;
      if (this.isCreate) {
        subscribe = this.createUsuario();
      } else if (this.isUpdate) {
        subscribe = this.updateUsuario();
      }
      subscribe
        .pipe(finalize(() => this.onCreateUpdate$.next(false)))
        .subscribe({
          next: () => this.messageSuccess(),
          error: () => {
            this.router.navigate(['/usuario']);
          },
        });
    }
  }

  createUsuario() {
    return this.usuarioCommandService.create(this.dtoToCreateUpdateUser());
  }

  updateUsuario() {
    return this.usuarioCommandService.update(
      this.responseUsuario.id,
      this.dtoToCreateUpdateUser(false)
    );
  }

  dtoToCreateUpdateUser(
    isCreate: boolean = true
  ): UsuarioCreateDto | UsuarioUpdateDto {
    if (isCreate) {
      const dto: UsuarioCreateDto = {
        username: this.form.value.username ?? '',
        email: this.form.value.email ?? '',
        firstName: this.form.value.firstName ?? '',
        lastName: this.form.value.lastName ?? '',
        password: this.form.value.password ?? '',
        roles: this.form.value.roles
          ? this.form.value.roles.map((r) => r.id)
          : [],
      };
      return dto;
    }
    const dto: UsuarioUpdateDto = {
      id: this.responseUsuario.id,
      username: this.form.value.username ?? '',
      email: this.form.value.email ?? '',
      firstName: this.form.value.firstName ?? '',
      lastName: this.form.value.lastName ?? '',
      password: this.form.value.password ?? '',
      roles: this.form.value.roles
        ? this.form.value.roles.map((r) => r.id)
        : [],
    };
    return dto;
  }

  messageSuccess() {
    const message = this.isCreate
      ? 'Usuário criado com sucesso!\nVocê será redirecionado.'
      : 'Usuário alterado com sucesso!\nVocê será redirecionado.';
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: message,
      life: 5000,
    });
    this.router.navigate(['/usuario']);
  }

  disableLabelsOnLoading() {
    this.onCreateUpdate$.asObservable().subscribe((isLoading) => {
      this.updateFormControls(isLoading);
    });
  }

  private updateFormControls(isLoading: boolean) {
    if (this.form?.controls && isLoading) {
      Object.keys(this.form?.controls).forEach((campo) => {
        this.form.get(campo).disable();
      });
    }
  }
}
