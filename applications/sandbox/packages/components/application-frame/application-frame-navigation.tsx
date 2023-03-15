import classnames from 'classnames';
import { JSX, splitProps } from 'solid-js';

import { CommonDataAttributes } from '$/types/generic';
import styles from '$sandbox/components/application-frame/application-frame.module.css';
import { DynamicRouteNavigation } from '$sandbox/stores/dynamic-routes';

import ApplicationFrameNavigationItem from './application-frame-navigation-item';
import ApplicationFrameSubNavigation from './application-frame-sub-navigation';

interface ApplicationFrameNavigationProps extends JSX.HTMLAttributes<HTMLDivElement>, CommonDataAttributes {
  routes: DynamicRouteNavigation;
}

const ApplicationFrameNavigation = (passedProps: ApplicationFrameNavigationProps) => {
  const [props, restOfProps] = splitProps(passedProps, ['routes', 'class']);

  return (
    <div data-id="navigation" class={classnames(styles.navigation, props.class)} {...restOfProps}>
      <ApplicationFrameNavigationItem path="/home">Home</ApplicationFrameNavigationItem>
      <ApplicationFrameSubNavigation routes={props.routes} />
    </div>
  );
};

export default ApplicationFrameNavigation;
