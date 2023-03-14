/* @refresh reload */
import '../../packages/types/solid-js';

import '@fontsource/inter';

import '../../packages/styles/variables.css';
import './variables.css';
import '../../packages/styles/keyframes.css';
import '../../packages/styles/normalize.css';
import { Route, Routes as SolidRoutes, Navigate, Router } from '@solidjs/router';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { For, Suspense } from 'solid-js';
import { render } from 'solid-js/web';

import HomeView from '$sandbox/views/home-view';

import GlobalNotificationsList from '../../packages/components/global-notifications-list';
import { applicationStore } from '../../packages/stores/application-store';
import { globalNotificationsStore } from '../../packages/stores/global-notifications-store';

import ApplicationFrame from './packages/components/application-frame/application-frame';
import { dynamicRoutesStore } from './packages/stores/dynamic-routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      useErrorBoundary: true,
    },
  },
});

const ApplicationWrapper = () => {
  const dynamicRoutes = dynamicRoutesStore.create();

  dynamicRoutes.load();

  return (
    <div data-theme={applicationStore.theme()}>
      <ApplicationFrame isLoading={dynamicRoutes.isLoading()} navigation={dynamicRoutes.navigation()}>
        <Suspense fallback="Loading...">
          <SolidRoutes>
            {/* these are the dynamic routes that are based on the files dynamically loaded with sandbox components */}
            <For each={dynamicRoutes.routes()}>
              {(route) => {
                return <Route path={route.path} component={route.component} />;
              }}
            </For>
            <Route path="/" element={<HomeView />} />
            <Route path="*" element={<Navigate href="/" />} />
          </SolidRoutes>
        </Suspense>
      </ApplicationFrame>
      <GlobalNotificationsList notifications={globalNotificationsStore.notifications()} />
    </div>
  );
};

export default ApplicationWrapper;

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ApplicationWrapper />
      </Router>
    </QueryClientProvider>
  ),
  document.getElementById('root') as HTMLElement,
);
