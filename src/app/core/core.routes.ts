//Angular
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

//Internos
import { HOME_ROUTES } from '@home/home.routes';
import { MARCA_ROUTES } from '@marca/marca.routes';
import { ALL_ROLES, ROLES } from '@shared/models/roles';
import { USUARIO_ROUTES } from '@usuario/usuario.routes';
import { PRODUTO_ROUTES } from '@produto/produto.routes';
import { CATEGORIA_ROUTES } from '@categoria/categoria.routes';

export const CORE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: HOME_ROUTES,
    data: {
      roles: ALL_ROLES,
    },
  },
  {
    path: 'categoria',
    canActivate: [AuthGuard],
    children: CATEGORIA_ROUTES,
    data: {
      roles: ALL_ROLES,
    },
  },
  {
    path: 'marca',
    canActivate: [AuthGuard],
    children: MARCA_ROUTES,
    data: {
      roles: ALL_ROLES,
    },
  },
  {
    path: 'usuario',
    canActivate: [AuthGuard],
    children: USUARIO_ROUTES,
    data: {
      roles: [ROLES.ADMIN],
    },
  },
  {
    path: 'produto',
    canActivate: [AuthGuard],
    children: PRODUTO_ROUTES,
    data: {
      roles: ALL_ROLES,
    },
  },
];
