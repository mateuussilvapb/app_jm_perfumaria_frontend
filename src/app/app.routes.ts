//Angular
import { Routes } from '@angular/router';

//Internos
import { ALL_ROLES } from './shared/models/roles';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./core/layout/layout.component').then((c) => c.LayoutComponent),
    data: {
      roles: [ALL_ROLES],
    },
  },
];
