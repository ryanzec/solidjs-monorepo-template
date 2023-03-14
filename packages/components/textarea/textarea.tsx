import classnames from 'classnames';
import { JSX, splitProps } from 'solid-js';

import styles from '$/components/textarea/textarea.module.css';

type TextareaProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = (passedProps: TextareaProps) => {
  const [props, restOfProps] = splitProps(passedProps, ['class']);

  return <textarea class={classnames(styles.textarea, props.class)} {...restOfProps} />;
};

export default Textarea;
