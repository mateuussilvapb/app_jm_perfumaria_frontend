//Angular
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

//Internos
import { HOME_ROUTES } from 'app/modules/home/home.routes';
import { ALL_ROLES } from 'app/shared/models/roles';
import { MARCA_ROUTES } from 'app/modules/marca/marca.routes';
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
  {
    path: 'marca',
    canActivate: [AuthGuard],
    children: MARCA_ROUTES,
    data: {
      roles: [ALL_ROLES],
    },
  },
];