import ScheduleViewer from '@/views/ScheduleViewer.vue';
import ScheduleCreator from '@/views/ScheduleCreator.vue';
import SettingsEditor from '@/views/SettingsEditor.vue';

export const routes = [
    { path: '/', component: ScheduleViewer },
    { path: '/create', component: ScheduleCreator },
    { path: '/settings', component: SettingsEditor },
];
