import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store, { key } from './store';
import 'bootstrap';
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUser } from '@fortawesome/free-solid-svg-icons';
import auth, { authKey } from '@/store/auth';

/* add icons to the library */
library.add([faUser]);
console.log(process.env.VUE_APP_NOT_SECRET_CODE)

createApp(App)
  .component('fa-icon', FontAwesomeIcon)
  .use(store, key)
  .use(auth, authKey)
  .use(router)
  .mount('#app');
