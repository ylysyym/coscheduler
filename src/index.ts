import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from '@/App.vue';
import Router from '@/router';

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
