import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'

const MyPreset = definePreset(Aura, {
  primitive: {
    midnight: {
      50: '#E0EEFF',
      100: '#BDDAFF',
      200: '#68AAFD',
      300: '#0059C7',
      400: '#00377A',
      500: '#00224D',
      600: '#00142E',
      700: '#000E1F',
      800: '#000914',
      900: '#00070F',
      950: '#000205'
    },
    turquoise: {
      50: '#C0F1FC',
      100: '#ADEDFB',
      200: '#86E5F9',
      300: '#5FDCF8',
      400: '#38D4F6',
      500: '#11CBF4',
      600: '#09A2C4',
      700: '#07768E',
      800: '#044959',
      900: '#021D23',
      950: '#000708',
    },
  },
  semantic: {
    primary: {
      50: '{midnight.50}',
      100: '{midnight.100}',
      200: '{midnight.200}',
      300: '{midnight.300}',
      400: '{midnight.400}',
      500: '{midnight.500}',
      600: '{midnight.600}',
      700: '{midnight.700}',
      800: '{midnight.800}',
      900: '{midnight.900}',
      950: '{midnight.950}',
    },
  },
})

const PrimevueOptions = {
  theme: {
    preset: MyPreset,
    options: {
      prefix: 'p',
      darkModeSelector: '.p-dark',
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities',
      },
    },
  },
}

export default PrimevueOptions
