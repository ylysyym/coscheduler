import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from '@/App.vue';
import ScheduleView from '@/ScheduleView.vue';

const main = function () {
    const app = createApp(App);
    app.use(createPinia());

    const routes = [{ path: '/', component: ScheduleView }];

    app.use(
        createRouter({
            history: createWebHashHistory(),
            routes,
        })
    );
    app.mount('#app');
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        main();
    });
} else {
    main();
}
