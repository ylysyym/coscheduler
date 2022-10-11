import ScheduleViewer from '@/views/ScheduleViewer.vue';
import ScheduleCreator from '@/views/ScheduleCreator.vue';

export const routes = [
    { path: '/', component: ScheduleViewer },
    { path: '/create', component: ScheduleCreator },
];
