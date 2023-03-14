import classnames from 'classnames';

import styles from '$/components/application-loading/application-loading.module.css';

const ApplicationLoading = () => {
  return (
    <div data-id="application-loading" class={classnames(styles.applicationLoading)}>
      LOADING APPLICATION...
    </div>
  );
};

export default ApplicationLoading;
