//Angular
import { Routes } from '@angular/router';

//Internos
import { ALL_ROLES } from '@shared/models/roles';
import { AuthGuard } from '@core/guards/auth.guard';
import { PainelInformativoComponent } from '@home/painel-informativo/painel-informativo.component';

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
