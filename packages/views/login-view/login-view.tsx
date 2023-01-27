import { useNavigate } from '@solidjs/router';
import classnames from 'classnames';
import { createEffect } from 'solid-js';

import Button from '$/components/button';
import { applicationStore } from '$/stores/application-store';
import styles from '$/views/login-view/login-view.module.css';

const LoginView = () => {
  const navigate = useNavigate();

  const onLogin = async () => {
    await applicationStore.login();
  };

  createEffect(() => {
    const loginRedirectUrl = applicationStore.redirectUrl();

    if (!loginRedirectUrl) {
      return;
    }

    navigate(loginRedirectUrl);
    applicationStore.finishLogin();
  });

  return (
    <div data-id="login-view" class={classnames(styles.page)}>
      <Button data-id="login-button" /*context={ButtonContext.SAFE}*/ onClick={onLogin}>
        Login
      </Button>
    </div>
  );
};

export default LoginView;
