import { Show } from 'solid-js';

import ApplicationFrame from '$/components/application-frame';
import ApplicationLoading from '$/components/application-loading';
import Routes from '$/components/routing';
import { applicationStore } from '$/stores/application-store';

const ApplicationWrapper = () => {
  return (
    <div data-theme={applicationStore.theme()}>
      <ApplicationFrame>
        <Show when={applicationStore.isLoading() === false} fallback={<ApplicationLoading />}>
          <Routes />
        </Show>
      </ApplicationFrame>
    </div>
  );
};

export default ApplicationWrapper;
