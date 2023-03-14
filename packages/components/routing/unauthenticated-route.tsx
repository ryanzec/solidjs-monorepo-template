import { Navigate } from '@solidjs/router';
import { ParentProps } from 'solid-js';

import { applicationStore } from '$/stores/application-store';

const UnauthenticatedRoute = (props: ParentProps) => {
  if (applicationStore.isAuthenticated()) {
    return <Navigate href="/home" />;
  }

  return props.children;
};

export default UnauthenticatedRoute;
