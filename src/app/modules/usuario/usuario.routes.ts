//Angular
import { Routes } from '@angular/router';

//Internos
import { ROLES } from '@shared/models/roles';
import { AuthGuard } from '@core/guards/auth.guard';
import { ROTAS_FORM } from '@shared/enums/rotas-form.enum';
import { UsuarioFormComponent } from '@usuario/pages/usuario-form/usuario-form.component';
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
  {
    path: `${ROTAS_FORM.ADICIONAR}`,
    canActivate: [AuthGuard],
    component: UsuarioFormComponent,
    data: {
      roles: [ROLES.ADMIN],
    },
  },
  {
    path: `:id/${ROTAS_FORM.VISUALIZAR}`,
    canActivate: [AuthGuard],
    component: UsuarioFormComponent,
    data: {
      roles: [ROLES.ADMIN],
    },
  },
  {
    path: `:id/${ROTAS_FORM.EDITAR}`,
    canActivate: [AuthGuard],
    component: UsuarioFormComponent,
    data: {
      roles: [ROLES.ADMIN],
    },
  },
];
