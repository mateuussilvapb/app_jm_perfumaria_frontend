//Angular
import { Routes } from '@angular/router';

//Internos
import { AuthGuard } from '@core/guards/auth.guard';
import { ALL_ROLES, ROLES } from '@shared/models/roles';
import { ROTAS_FORM } from '@shared/enums/rotas-form.enum';
import { EntradaEstoqueFormComponent } from '@entrada-estoque/pages/entrada-estoque-form/entrada-estoque-form.component';
import { EntradaEstoqueListComponent } from '@entrada-estoque/pages/entrada-estoque-list/entrada-estoque-list.component';

export const ENTRADA_ESTOQUE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: EntradaEstoqueListComponent,
    data: {
      roles: ALL_ROLES,
    },
  },
  {
    path: `${ROTAS_FORM.ADICIONAR}`,
    canActivate: [AuthGuard],
    component: EntradaEstoqueFormComponent,
    data: {
      roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
  },
  {
    path: `:id/${ROTAS_FORM.VISUALIZAR}`,
    canActivate: [AuthGuard],
    component: EntradaEstoqueFormComponent,
    data: {
      roles: ALL_ROLES,
    },
  },
  {
    path: `:id/${ROTAS_FORM.EDITAR}`,
    canActivate: [AuthGuard],
    component: EntradaEstoqueFormComponent,
    data: {
      roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
  },
];
