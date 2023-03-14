import classnames from 'classnames';
import { JSX, ParentProps, splitProps } from 'solid-js';

import styles from '$/components/input/input.module.css';

type InputContainerProps = JSX.HTMLAttributes<HTMLDivElement>;

const InputContainer = (props: ParentProps<InputContainerProps>) => {
  const [local, restOfProps] = splitProps(props, ['class', 'children']);

  return (
    <div data-id="input-container" class={classnames(local.class, styles.container)} {...restOfProps}>
      {local.children}
    </div>
  );
};

export default InputContainer;
