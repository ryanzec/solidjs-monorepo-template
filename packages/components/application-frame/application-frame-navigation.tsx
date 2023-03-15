import classnames from 'classnames';
import { JSX, splitProps } from 'solid-js';

import ApplicationFrameNavigationItem, {
  ApplicationFrameNavigationItemProps,
} from '$/components/application-frame/application-frame-navigation-item';
import styles from '$/components/application-frame/application-frame.module.css';
import Icon from '$/components/icon';
import { CommonDataAttributes } from '$/types/generic';

type ApplicationFrameNavigationProps = JSX.HTMLAttributes<HTMLDivElement> & CommonDataAttributes;

const navigationItems: ApplicationFrameNavigationItemProps[] = [
  {
    icon: <Icon.HeroHome />,
    text: 'Home',
    navigateTo: '/',
  },
  {
    icon: <Icon.HeroHome />,
    text: 'Form',
    navigateTo: '/complex-form',
  },
];

const ApplicationFrameNavigation = (passedProps: ApplicationFrameNavigationProps) => {
  const [props, restOfProps] = splitProps(passedProps, ['class']);

  return (
    <div data-id="navigation" class={classnames(styles.navigation, props.class)} {...restOfProps}>
      {navigationItems.map((navigationItem) => {
        return <ApplicationFrameNavigationItem {...navigationItem} />;
      })}
    </div>
  );
};

export default ApplicationFrameNavigation;
