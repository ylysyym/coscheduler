import ScheduleCreator from '@/views/ScheduleCreator.vue';
import ScheduleViewer from '@/views/ScheduleViewer.vue';
import SettingsEditor from '@/views/SettingsEditor.vue';

export const routes = [
    { path: '/schedule/:id', component: ScheduleViewer, props: true },
    { path: '/create', component: ScheduleCreator, alias: '/' },
    { path: '/settings', component: SettingsEditor },
];
