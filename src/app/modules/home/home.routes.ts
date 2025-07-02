import { Routes } from '@angular/router';
import { PainelInformativoComponent } from './painel-informativo/painel-informativo.component';
import { AuthGuard } from 'app/core/guards/auth.guard';
import { ALL_ROLES } from 'app/shared/models/roles';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: PainelInformativoComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [ALL_ROLES],
    },
  },
];
