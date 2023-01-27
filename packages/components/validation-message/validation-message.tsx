import classnames from 'classnames';
import { Index, JSX, splitProps } from 'solid-js';

import styles from '$/components/validation-message/validation-message.module.css';

interface ValidationMessageProps extends JSX.HTMLAttributes<HTMLDivElement> {
  messages?: string[] | null;
}

const ValidationMessage = (props: ValidationMessageProps) => {
  const [local, restOfProps] = splitProps(props, ['messages']);

  return (
    <div data-id="validation-message" class={classnames(styles.validationMessage)} {...restOfProps}>
      <Index each={local.messages}>
        {(message) => {
          return <div>{message()}</div>;
        }}
      </Index>
    </div>
  );
};

export default ValidationMessage;
