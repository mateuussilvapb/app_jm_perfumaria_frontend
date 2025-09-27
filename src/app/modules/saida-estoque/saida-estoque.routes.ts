//Angular
import { Routes } from '@angular/router';

//Internos
import { AuthGuard } from '@core/guards/auth.guard';
import { ALL_ROLES, ROLES } from '@shared/models/roles';
import { ROTAS_FORM } from '@shared/enums/rotas-form.enum';
import { SaidaEstoqueFormComponent } from '@saida-estoque/pages/saida-estoque-form/saida-estoque-form.component';
import { SaidaEstoqueListComponent } from '@saida-estoque/pages/saida-estoque-list/saida-estoque-list.component';

export const SAIDA_ESTOQUE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: SaidaEstoqueListComponent,
    data: {
      roles: ALL_ROLES,
    },
  },
  {
    path: `${ROTAS_FORM.ADICIONAR}`,
    canActivate: [AuthGuard],
    component: SaidaEstoqueFormComponent,
    data: {
      roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
  },
  {
    path: `:id/${ROTAS_FORM.VISUALIZAR}`,
    canActivate: [AuthGuard],
    component: SaidaEstoqueFormComponent,
    data: {
      roles: ALL_ROLES,
    },
  },
  {
    path: `:id/${ROTAS_FORM.EDITAR}`,
    canActivate: [AuthGuard],
    component: SaidaEstoqueFormComponent,
    data: {
      roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
  },
];
