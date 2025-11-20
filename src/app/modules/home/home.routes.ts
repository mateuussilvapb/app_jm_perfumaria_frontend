//Angular
import { Routes } from '@angular/router';

//Internos
import { ALL_ROLES } from '@shared/models/roles';
import { AuthGuard } from '@core/guards/auth.guard';
import { DashboardComponent } from '@home/pages/dashboard/dashboard.component';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ALL_ROLES,
    },
  },
];
