import { createSignal, createContext, useContext, ParentProps, Accessor } from 'solid-js';

import { ButtonContext, ButtonSize, ButtonVariant } from '$/components/button/utils';

interface ButtonGroupProviderParams {
  context: ButtonContext;
  size: ButtonSize;
  variant: ButtonVariant;
  disabled: boolean;
  isAttached: boolean;
}

interface ButtonGroupProviderContext {
  context: Accessor<ButtonContext>;
  size: Accessor<ButtonSize>;
  variant: Accessor<ButtonVariant>;
  disabled: Accessor<boolean>;
  isAttached: Accessor<boolean>;
}

const ButtonGroupContext = createContext<ButtonGroupProviderContext>();

const ButtonGroupProvider = (props: ParentProps<ButtonGroupProviderParams>) => {
  const [isAttached] = createSignal<boolean>(props.isAttached);
  const [variant] = createSignal<ButtonVariant>(props.variant);
  const [size] = createSignal<ButtonSize>(props.size);
  const [context] = createSignal<ButtonContext>(props.context);
  const [disabled] = createSignal<boolean>(props.disabled);

  return (
    <ButtonGroupContext.Provider
      value={{
        isAttached,
        variant,
        size,
        context,
        disabled,
      }}
    >
      {props.children}
    </ButtonGroupContext.Provider>
  );
};

const useButtonGroupContext = () => {
  return useContext(ButtonGroupContext);
};

export { ButtonGroupProvider, useButtonGroupContext };
