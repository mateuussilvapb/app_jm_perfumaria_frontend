//Angular
import { Routes } from '@angular/router';

//Internos
import { ALL_ROLES } from '@shared/models/roles';
import { AuthGuard } from '@core/guards/auth.guard';
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
];
