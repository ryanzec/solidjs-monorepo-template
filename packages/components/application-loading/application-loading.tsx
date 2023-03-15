import classnames from 'classnames';
import { JSX, splitProps } from 'solid-js';

import styles from '$/components/application-loading/application-loading.module.css';
import { CommonDataAttributes } from '$/types/generic';

const ApplicationLoading = (passedProps: JSX.HTMLAttributes<HTMLDivElement> & CommonDataAttributes) => {
  const [props, restOfProps] = splitProps(passedProps, ['class']);

  return (
    <div data-id="application-loading" class={classnames(styles.applicationLoading, props.class)} {...restOfProps}>
      LOADING APPLICATION...
    </div>
  );
};

export default ApplicationLoading;
