import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HOME_ROUTES } from 'app/modules/home/home.routes';
import { ALL_ROLES } from 'app/shared/models/roles';

export const CORE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: HOME_ROUTES,
    data: {
      roles: [ALL_ROLES],
    },
  },
];
