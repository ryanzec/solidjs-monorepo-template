import classnames from 'classnames';
import { Index, JSX, Show, splitProps } from 'solid-js';

import styles from '$/components/validation-message/validation-message.module.css';
import { CommonDataAttributes } from '$/types/generic';

interface ValidationMessageProps extends JSX.HTMLAttributes<HTMLDivElement>, CommonDataAttributes {
  messages?: string[] | null;
}

const ValidationMessage = (passedProps: ValidationMessageProps) => {
  const [props, restOfProps] = splitProps(passedProps, ['messages', 'class']);

  return (
    <Show when={props.messages && props.messages.length > 0}>
      <div data-id="validation-message" class={classnames(styles.validationMessage)} {...restOfProps}>
        <Index each={props.messages}>
          {(message) => {
            return <div>{message()}</div>;
          }}
        </Index>
      </div>
    </Show>
  );
};

export default ValidationMessage;
