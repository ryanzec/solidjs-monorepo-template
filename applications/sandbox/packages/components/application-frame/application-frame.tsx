import classnames from 'classnames';
import { ParentProps, Show } from 'solid-js';

import styles from '$sandbox/components/application-frame/application-frame.module.css';

// @todo(refactor) replace with sandbox specific store
import { applicationStore } from '../../../../../packages/stores/application-store';
import { DynamicRouteNavigation } from '../../stores/dynamic-routes';

import ApplicationFrameNavigation from './application-frame-navigation';

interface ApplicationFrameProps {
  isLoading: boolean;
  navigation: DynamicRouteNavigation;
}

const ApplicationFrame = (props: ParentProps<ApplicationFrameProps>) => {
  return (
    <div data-theme={applicationStore.theme()}>
      <div data-id="application-frame" class={classnames(styles.applicationFrame)}>
        <Show when={props.isLoading === false} fallback={<div>Loading</div>}>
          <ApplicationFrameNavigation routes={props.navigation} />
          <div class={classnames(styles.subContainer)}>
            <div class={classnames(styles.mainContent)}>{props.children}</div>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default ApplicationFrame;
