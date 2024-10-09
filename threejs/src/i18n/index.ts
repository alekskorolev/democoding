import { createI18n } from 'vue-i18n';
import ru from './ru.json';

const i18n = createI18n({
  locale: 'ru',
  messages: {
    ru,
  },
  // something vue-i18n options here ...
});

export default i18n;
