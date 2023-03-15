import { useNavigate } from '@solidjs/router';
import classnames from 'classnames';
import { JSX, splitProps } from 'solid-js';

import styles from '$/components/application-frame/application-frame.module.css';
import { CommonDataAttributes } from '$/types/generic';

export interface ApplicationFrameNavigationItemProps extends JSX.HTMLAttributes<HTMLDivElement>, CommonDataAttributes {
  icon: JSX.Element;
  text: string;
  navigateTo: string;
}

const ApplicationFrameNavigationItem = (passedProps: ApplicationFrameNavigationItemProps) => {
  const [props, restOfProps] = splitProps(passedProps, ['icon', 'text', 'navigateTo']);
  const navigate = useNavigate();

  const onNavigate = () => {
    navigate(props.navigateTo);
  };

  return (
    <div
      role="button"
      class={classnames(styles.navigationItem)}
      tabIndex={0}
      data-id="item"
      onClick={onNavigate}
      // this is needed for a11y though not sure what this event should do
      onKeyPress={() => {}}
      {...restOfProps}
    >
      {props.icon} {props.text}
    </div>
  );
};

export default ApplicationFrameNavigationItem;
