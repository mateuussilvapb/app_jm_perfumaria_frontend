//Angular
import { Routes } from '@angular/router';

//Internos
import { AuthGuard } from 'app/core/guards/auth.guard';
import { ALL_ROLES, ROLES } from 'app/shared/models/roles';
import { ROTAS_FORM } from '@shared/enums/rotas-form.enum';
import { ProdutoListComponent } from './pages/produto-list/produto-list.component';
import { ProdutoFormComponent } from './pages/produto-form/produto-form.component';

export const PRODUTO_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: ProdutoListComponent,
    data: {
      roles: [ALL_ROLES],
    },
  },
  {
    path: `${ROTAS_FORM.ADICIONAR}`,
    canActivate: [AuthGuard],
    component: ProdutoFormComponent,
    data: {
      roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
  },
  {
    path: `:id/${ROTAS_FORM.VISUALIZAR}`,
    canActivate: [AuthGuard],
    component: ProdutoFormComponent,
    data: {
      roles: [ALL_ROLES],
    },
  },
  {
    path: `:id/${ROTAS_FORM.EDITAR}`,
    canActivate: [AuthGuard],
    component: ProdutoFormComponent,
    data: {
      roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
  },
];
