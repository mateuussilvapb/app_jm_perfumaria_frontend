//Angular
import { Routes } from '@angular/router';

//Internos
import { AuthGuard } from '@core/guards/auth.guard';
import { ALL_ROLES, ROLES } from '@shared/models/roles';
import { ROTAS_FORM } from '@shared/enums/rotas-form.enum';
import { CategoriaFormComponent } from '@categoria/pages/categoria-form/categoria-form.component';
import { CategoriaListComponent } from '@categoria/pages/categoria-list/categoria-list.component';

export const CATEGORIA_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: CategoriaListComponent,
    data: {
      roles: [ALL_ROLES],
    },
  },
  {
    path: `${ROTAS_FORM.ADICIONAR}`,
    canActivate: [AuthGuard],
    component: CategoriaFormComponent,
    data: {
      roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
  },
  {
    path: `:id/${ROTAS_FORM.VISUALIZAR}`,
    canActivate: [AuthGuard],
    component: CategoriaFormComponent,
    data: {
      roles: [ALL_ROLES],
    },
  },
  {
    path: `:id/${ROTAS_FORM.EDITAR}`,
    canActivate: [AuthGuard],
    component: CategoriaFormComponent,
    data: {
      roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
  },
];
