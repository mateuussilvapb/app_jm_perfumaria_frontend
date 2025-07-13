//Externos
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';

//Internos
import { Opcoes } from '../primeNG/traducao.config';

export const PRIMENG_PROVIDER = providePrimeNG({
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: '.app_jm_perfumaria',
      cssLayer: false,
    },
  },
  ripple: false,
  translation: Opcoes.traducaoPtBr,
});
