import classnames from 'classnames';
import { JSX, ParentProps, splitProps } from 'solid-js';

import styles from '$/components/input/input.module.css';
import { CommonDataAttributes } from '$/types/generic';

type InputContainerProps = JSX.HTMLAttributes<HTMLDivElement> & CommonDataAttributes;

const InputContainer = (passedProps: ParentProps<InputContainerProps>) => {
  const [props, restOfProps] = splitProps(passedProps, ['class', 'children']);

  return (
    <div data-id="input-container" class={classnames(props.class, styles.container)} {...restOfProps}>
      {props.children}
    </div>
  );
};

export default InputContainer;
