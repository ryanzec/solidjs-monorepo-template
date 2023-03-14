import classnames from 'classnames';
import { JSX, mergeProps, splitProps } from 'solid-js';

import styles from '$/components/button/button.module.css';
import { ButtonIconPosition, DEFAULT_BUTTON_ICON_POSITION } from '$/components/button/utils';
import Icon from '$/components/icon';

export interface ButtonIconProps extends JSX.HTMLAttributes<HTMLDivElement> {
  position?: ButtonIconPosition;
  isLoading?: boolean;
  icon: JSX.Element;
}

const ButtonIcon = (props: ButtonIconProps) => {
  const [local, restOfProps] = splitProps(
    mergeProps({ position: DEFAULT_BUTTON_ICON_POSITION, isLoading: false }, props),
    ['position', 'isLoading', 'icon'],
  );
  let dataId = 'icon';

  dataId += local.isLoading ? ' loading' : '';
  dataId += local.position === ButtonIconPosition.PRE ? ' pre' : ' post';

  return (
    <div
      data-id={dataId}
      class={classnames(styles.icon, {
        [styles.iconPre]: local.position === ButtonIconPosition.PRE,
        [styles.iconPost]: local.position === ButtonIconPosition.POST,
        [styles.iconIsLoading]: local.isLoading,
      })}
      {...restOfProps}
    >
      {local.isLoading ? <Icon.HeroHome /> : local.icon}
    </div>
  );
};

export default ButtonIcon;
