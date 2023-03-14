import { Navigate } from '@solidjs/router';
import { ParentProps } from 'solid-js';

import { applicationStore } from '$/stores/application-store';

const AuthenticatedRoute = (props: ParentProps) => {
  if (!applicationStore.isAuthenticated()) {
    return <Navigate href="/login" />;
  }

  return props.children;
};

export default AuthenticatedRoute;
