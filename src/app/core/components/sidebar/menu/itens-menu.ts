import { PrimeIcons } from 'primeng/api';

interface ItemMenu {
  label: string;
  separator: boolean;
  route?: string;
  icon?: string;
  children?: ItemMenu[];
}

export const ItensMenu: ItemMenu[] = [
  {
    label: 'HOME',
    separator: true,
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
    children: [
      {
        label: 'Categorias',
        separator: false,
        icon: PrimeIcons.BOOKMARK,
        route: '/categoria',
      },
    ],
  },
];
