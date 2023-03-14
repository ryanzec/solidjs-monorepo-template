import classnames from 'classnames';
import { JSX, mergeProps, ParentProps, splitProps } from 'solid-js';

import styles from '$/components/button/button.module.css';
import { ButtonGroupProvider } from '$/components/button/context';
import {
  ButtonContext,
  ButtonSize,
  ButtonVariant,
  DEFAULT_BUTTON_CONTEXT,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_VARIANT,
} from '$/components/button/utils';

interface ButtonGroupProps extends JSX.HTMLAttributes<HTMLDivElement> {
  context?: ButtonContext;
  size?: ButtonSize;
  variant?: ButtonVariant;
  disabled?: boolean;
  isAttached?: boolean;
}

const ButtonGroup = (props: ParentProps<ButtonGroupProps>) => {
  const [local, restOfProps] = splitProps(
    mergeProps(
      {
        isAttached: false,
        variant: DEFAULT_BUTTON_VARIANT,
        size: DEFAULT_BUTTON_SIZE,
        context: DEFAULT_BUTTON_CONTEXT,
        disabled: false,
      },
      props,
    ),
    ['children', 'isAttached', 'variant', 'size', 'context', 'disabled'],
  );

  return (
    <ButtonGroupProvider
      isAttached={local.isAttached}
      variant={local.variant}
      context={local.context}
      size={local.size}
      disabled={local.disabled}
    >
      <div
        data-id="button-group"
        role="group"
        class={classnames(styles.group, { [styles.isAttached]: local.isAttached })}
        {...restOfProps}
      >
        {local.children}
      </div>
    </ButtonGroupProvider>
  );
};

export default ButtonGroup;
