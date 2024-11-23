import './assets/main.css'
import 'primeicons/primeicons.css'
import '@fontsource-variable/inter'
import 'material-icons/iconfont/outlined.css'
import 'material-icons/iconfont/round.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

import App from './App.vue'
import router from './router'
import PrimevueOptions from './config/primevue.config'
import Ripple from 'primevue/ripple'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, PrimevueOptions)
app.directive('ripple', Ripple)
app.use(ConfirmationService)
app.use(ToastService)


app.mount('#app')
