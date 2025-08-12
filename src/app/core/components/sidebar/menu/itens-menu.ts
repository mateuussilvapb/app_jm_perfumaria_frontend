//Externos
import { PrimeIcons } from 'primeng/api';

//Internos
import { ALL_ROLES, ROLES } from '@shared/models/roles';

export interface ItemMenu {
  label: string;
  separator: boolean;
  route?: string;
  icon?: string;
  roles?: ROLES[];
  children?: ItemMenu[];
}

export const ItensMenu: ItemMenu[] = [
  {
    label: 'HOME',
    separator: true,
    roles: ALL_ROLES,
    children: [
      {
        label: 'Painel Informativo',
        separator: false,
        icon: PrimeIcons.CHART_BAR,
        route: '/',
      },
    ],
  },
  {
    label: 'CATEGORIA',
    separator: true,
    roles: ALL_ROLES,
    children: [
      {
        label: 'Listar Categorias',
        separator: false,
        icon: PrimeIcons.BOOKMARK,
        route: '/categoria',
      },
      {
        label: 'Adicionar Categoria',
        separator: false,
        roles: [ROLES.ADMIN, ROLES.MANAGER],
        icon: PrimeIcons.PLUS_CIRCLE,
        route: '/categoria/adicionar',
      },
    ],
  },
  {
    label: 'MARCA',
    separator: true,
    roles: ALL_ROLES,
    children: [
      {
        label: 'Listar Marcas',
        separator: false,
        icon: PrimeIcons.BOOKMARK,
        route: '/marca',
      },
      {
        label: 'Adicionar Marca',
        separator: false,
        roles: [ROLES.ADMIN, ROLES.MANAGER],
        icon: PrimeIcons.PLUS_CIRCLE,
        route: '/marca/adicionar',
      },
    ],
  },
  {
    label: 'USUÁRIO',
    separator: true,
    roles: [ROLES.ADMIN],
    children: [
      {
        label: 'Listar Usuários',
        separator: false,
        icon: PrimeIcons.USER,
        route: '/usuario',
      },
      {
        label: 'Adicionar Usuário',
        separator: false,
        icon: PrimeIcons.USER_PLUS,
        route: '/usuario/adicionar',
      },
    ],
  },
];
