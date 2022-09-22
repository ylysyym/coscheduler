import ScheduleView from '@/views/ScheduleView.vue';
import CreationView from '@/views/CreationView.vue';

export const routes = [
    { path: '/', component: ScheduleView },
    { path: '/create', component: CreationView },
];
