import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/App.vue';

const main = function () {
    createApp(App).use(createPinia()).mount('#app');
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        main();
    });
} else {
    main();
}
