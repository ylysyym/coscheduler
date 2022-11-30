import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Router from '@/router';
import App from '@/App.vue';

const main = function () {
    const app = createApp(App);

    app.use(createPinia());
    app.use(Router);

    app.mount('#app');
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        main();
    });
} else {
    main();
}
