import classnames from 'classnames';

import styles from '$sandbox/components/application-frame/application-frame.module.css';

import { DynamicRouteNavigation } from '../../stores/dynamic-routes';

import ApplicationFrameNavigationItem from './application-frame-navigation-item';
import ApplicationFrameSubNavigation from './application-frame-sub-navigation';

interface ApplicationFrameNavigationProps {
  routes: DynamicRouteNavigation;
}

const ApplicationFrameNavigation = (props: ApplicationFrameNavigationProps) => {
  return (
    <div data-id="navigation" class={classnames(styles.navigation)}>
      <ApplicationFrameNavigationItem path="/home">Home</ApplicationFrameNavigationItem>
      <ApplicationFrameSubNavigation routes={props.routes} />
    </div>
  );
};

export default ApplicationFrameNavigation;
