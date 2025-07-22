//Angular
import { Routes } from '@angular/router';

//Internos
import { AuthGuard } from 'app/core/guards/auth.guard';
import { ALL_ROLES, ROLES } from 'app/shared/models/roles';
import { ROTAS_FORM } from '@shared/enums/rotas-form.enum';
import { MarcaListComponent } from './pages/marca-list/marca-list.component';
import { MarcaFormComponent } from './pages/marca-form/marca-form.component';

export const MARCA_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: MarcaListComponent,
    data: {
      roles: [ALL_ROLES],
    },
  },
  {
    path: `${ROTAS_FORM.ADICIONAR}`,
    canActivate: [AuthGuard],
    component: MarcaFormComponent,
    data: {
      roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
  },
  {
    path: `:id/${ROTAS_FORM.VISUALIZAR}`,
    canActivate: [AuthGuard],
    component: MarcaFormComponent,
    data: {
      roles: [ALL_ROLES],
    },
  },
  {
    path: `:id/${ROTAS_FORM.EDITAR}`,
    canActivate: [AuthGuard],
    component: MarcaFormComponent,
    data: {
      roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
  },
];
