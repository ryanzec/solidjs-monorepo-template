import classnames from 'classnames';

import ApplicationFrameNavigationItem, {
  ApplicationFrameNavigationItemProps,
} from '$/components/application-frame/application-frame-navigation-item';
import styles from '$/components/application-frame/application-frame.module.css';
import Icon from '$/components/icon';

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

const ApplicationFrameNavigation = () => {
  return (
    <div data-id="navigation" class={classnames(styles.navigation)}>
      {navigationItems.map((navigationItem) => {
        return <ApplicationFrameNavigationItem {...navigationItem} />;
      })}
    </div>
  );
};

export default ApplicationFrameNavigation;
