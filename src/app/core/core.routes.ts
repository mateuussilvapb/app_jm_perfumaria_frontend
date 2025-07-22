//Angular
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

//Internos
import { HOME_ROUTES } from '@home/home.routes';
import { ALL_ROLES } from '@shared/models/roles';
import { CATEGORIA_ROUTES } from '@categoria/categoria.routes';

export const CORE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: HOME_ROUTES,
    data: {
      roles: [ALL_ROLES],
    },
  },
  {
    path: 'categoria',
    canActivate: [AuthGuard],
    children: CATEGORIA_ROUTES,
    data: {
      roles: [ALL_ROLES],
    },
  },
];
