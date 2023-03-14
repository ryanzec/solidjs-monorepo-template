import classnames from 'classnames';
import { JSX, mergeProps, ParentProps, splitProps } from 'solid-js';

import ButtonIcon from '$/components/button/button-icon';
import styles from '$/components/button/button.module.css';
import { useButtonGroupContext } from '$/components/button/context';
import {
  ButtonContext,
  ButtonIconPosition,
  ButtonSize,
  ButtonState,
  ButtonVariant,
  DEFAULT_BUTTON_CONTEXT,
  DEFAULT_BUTTON_ICON_POSITION,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_VARIANT,
} from '$/components/button/utils';
import Icon from '$/components/icon';

export const isValidAttachedVariant = (variant: ButtonVariant): boolean => {
  return variant !== ButtonVariant.GHOST && variant !== ButtonVariant.LINK;
};

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  context?: ButtonContext;
  size?: ButtonSize;
  preIcon?: JSX.Element;
  postIcon?: JSX.Element;
  variant?: ButtonVariant;
  disabled?: boolean;
  loadingIconPosition?: ButtonIconPosition;
  state?: ButtonState;
}

export const Button = (props: ParentProps<ButtonProps>) => {
  const buttonGroupContext = useButtonGroupContext();
  const [local, restOfProps] = splitProps(
    mergeProps(
      {
        context: DEFAULT_BUTTON_CONTEXT,
        size: DEFAULT_BUTTON_SIZE,
        state: ButtonState.DEFAULT,
        variant: DEFAULT_BUTTON_VARIANT,
        disabled: false,
        loadingIconPosition: DEFAULT_BUTTON_ICON_POSITION,
      },
      props,
    ),
    [
      'children',
      'context',
      'size',
      'state',
      'preIcon',
      'postIcon',
      'variant',
      'disabled',
      'loadingIconPosition',
      'class',
    ],
  );

  // if button are attached then in order to make sure they look good, we should force all buttons to be the size
  // that was specified in the button group regardless of what the button has defined
  const useSize = (buttonGroupContext?.isAttached ? buttonGroupContext.size() : local.size) ?? DEFAULT_BUTTON_SIZE;
  const isLoading = local.state === ButtonState.IS_LOADING;

  // certain variant (like ghost and links) don't work well with attached group (as their styling does not make them
  // seem attached) so we need to revert to the group variant if one of those is defined on the button itself
  const useVariant =
    (buttonGroupContext?.isAttached && !isValidAttachedVariant(buttonGroupContext.variant())
      ? buttonGroupContext.variant()
      : local.variant) ?? DEFAULT_BUTTON_VARIANT;
  const useContext = () => useVariant !== ButtonVariant.LINK && useVariant !== ButtonVariant.UNSTYLED;

  return (
    <button
      class={classnames(styles.button, local.class, {
        [styles.small]: useSize === ButtonSize.SMALL,
        [styles.medium]: useSize === ButtonSize.MEDIUM,
        [styles.large]: useSize === ButtonSize.LARGE,
        [styles.unstyled]: useVariant === ButtonVariant.UNSTYLED,
        [styles.primary]: local.context === ButtonContext.PRIMARY && useContext(),
        [styles.safe]: local.context === ButtonContext.SAFE && useContext(),
        [styles.warning]: local.context === ButtonContext.WARNING && useContext(),
        [styles.danger]: local.context === ButtonContext.DANGER && useContext(),
        [styles.primaryOutline]: local.context === ButtonContext.PRIMARY && useVariant === ButtonVariant.OUTLINE,
        [styles.safeOutline]: local.context === ButtonContext.SAFE && useVariant === ButtonVariant.OUTLINE,
        [styles.warningOutline]: local.context === ButtonContext.WARNING && useVariant === ButtonVariant.OUTLINE,
        [styles.dangerOutline]: local.context === ButtonContext.DANGER && useVariant === ButtonVariant.OUTLINE,
        [styles.primaryGhost]: local.context === ButtonContext.PRIMARY && useVariant === ButtonVariant.GHOST,
        [styles.safeGhost]: local.context === ButtonContext.SAFE && useVariant === ButtonVariant.GHOST,
        [styles.warningGhost]: local.context === ButtonContext.WARNING && useVariant === ButtonVariant.GHOST,
        [styles.dangerGhost]: local.context === ButtonContext.DANGER && useVariant === ButtonVariant.GHOST,
        [styles.link]: useVariant === ButtonVariant.LINK,
      })}
      disabled={local.disabled || isLoading}
      data-id="button"
      type="button"
      {...restOfProps}
    >
      {(local.preIcon || (isLoading && local.loadingIconPosition === ButtonIconPosition.PRE)) && (
        <ButtonIcon
          position={ButtonIconPosition.PRE}
          isLoading={isLoading}
          icon={local.preIcon || <Icon.HeroArrowPath />}
        />
      )}
      {local.children}
      {(local.postIcon || (isLoading && local.loadingIconPosition === ButtonIconPosition.POST)) && (
        <ButtonIcon
          position={ButtonIconPosition.POST}
          isLoading={isLoading}
          icon={local.postIcon ?? <Icon.HeroArrowPath />}
        />
      )}
    </button>
  );
};

export default Button;
