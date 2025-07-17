//Angular
import { Routes } from '@angular/router';

//Internos
import { AuthGuard } from '@core/guards/auth.guard';
import { ALL_ROLES, ROLES } from '@shared/models/roles';
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
    path: 'adicionar',
    canActivate: [AuthGuard],
    component: CategoriaFormComponent,
    data: {
      roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
  },
  {
    path: ':id/visualizar',
    canActivate: [AuthGuard],
    component: CategoriaFormComponent,
    data: {
      roles: [ALL_ROLES],
    },
  },
  {
    path: ':id/editar',
    canActivate: [AuthGuard],
    component: CategoriaFormComponent,
    data: {
      roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
  },
];
