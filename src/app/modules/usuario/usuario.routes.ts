//Angular
import { Routes } from '@angular/router';

//Internos
import { ROLES } from '@shared/models/roles';
import { AuthGuard } from '@core/guards/auth.guard';
import { UsuarioListComponent } from '@usuario/pages/usuario-list/usuario-list.component';

export const USUARIO_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: UsuarioListComponent,
    data: {
      roles: [ROLES.ADMIN],
    },
  },
  // {
  //   path: `${ROTAS_FORM.ADICIONAR}`,
  //   canActivate: [AuthGuard],
  //   component: MarcaFormComponent,
  //   data: {
  //     roles: [ROLES.ADMIN, ROLES.MANAGER],
  //   },
  // },
  // {
  //   path: `:id/${ROTAS_FORM.VISUALIZAR}`,
  //   canActivate: [AuthGuard],
  //   component: MarcaFormComponent,
  //   data: {
  //     roles: ALL_ROLES,
  //   },
  // },
  // {
  //   path: `:id/${ROTAS_FORM.EDITAR}`,
  //   canActivate: [AuthGuard],
  //   component: MarcaFormComponent,
  //   data: {
  //     roles: [ROLES.ADMIN, ROLES.MANAGER],
  //   },
  // },
];
