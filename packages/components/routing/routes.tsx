import { Route, Routes as SolidRoutes, Navigate } from '@solidjs/router';
import { lazy } from 'solid-js';

import AuthenticatedRoute from '$/components/routing/authenticated-route';
import UnauthenticatedRoute from '$/components/routing/unauthenticated-route';

const HomeView = lazy(() => import('$/views/home-view'));
const LoginView = lazy(() => import('$/views/login-view'));
const ComplexFormView = lazy(() => import('$/views/complex-form-view'));

const Routes = () => {
  return (
    <SolidRoutes>
      <Route
        path="/complex-form"
        element={
          <AuthenticatedRoute>
            <ComplexFormView />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/home"
        element={
          <AuthenticatedRoute>
            <HomeView />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <UnauthenticatedRoute>
            <LoginView />
          </UnauthenticatedRoute>
        }
      />
      <Route path="*" element={<Navigate href="login" />} />
    </SolidRoutes>
  );
};

export default Routes;
