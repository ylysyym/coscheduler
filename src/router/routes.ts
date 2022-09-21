import ScheduleView from '@/ScheduleView.vue';
import CreationView from '@/CreationView.vue';

export const routes = [
    { path: '/', component: ScheduleView },
    { path: '/create', component: CreationView },
];
