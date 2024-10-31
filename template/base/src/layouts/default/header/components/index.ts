import FullScreen from './FullScreen.vue';
import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

export const UserDropDown = createAsyncComponent(() => import('./user-dropdown/index.vue'), {
  loading: true,
});

export const LayoutBreadcrumb = createAsyncComponent(() => import('./Breadcrumb.vue'));

export const Notify = createAsyncComponent(() => import('./notify/index.vue'));
export const sysMonitoring = createAsyncComponent(() => import('./sysMonitoring.vue'));
export const ErrorAction = createAsyncComponent(() => import('./ErrorAction.vue'));
export const MapLayout = createAsyncComponent(() => import('./mapLayout.vue'));
export const documents = createAsyncComponent(() => import('./document.vue'));

export { FullScreen };
