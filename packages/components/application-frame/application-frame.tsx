import { useNavigate } from '@solidjs/router';
import classnames from 'classnames';
import { Show, Suspense, JSX, createEffect, splitProps, ParentProps } from 'solid-js';

import styles from '$/components/application-frame/application-frame.module.css';
import Button from '$/components/button';
import { ButtonContext } from '$/components/button/utils';
import { applicationStore, LOCAL_STORAGE_AUTHENTICATION_TOKEN_KEY } from '$/stores/application-store';
import { CommonDataAttributes } from '$/types/generic';
import { applicationUtils, GlobalVariable } from '$/utils/application';
import { httpUtils } from '$/utils/http';
import { localStorageCacheUtils } from '$/utils/local-storage-cache';

import ApplicationFrameNavigation from './application-frame-navigation';

const ApplicationFrame = (passedProps: ParentProps<JSX.HTMLAttributes<HTMLDivElement> & CommonDataAttributes>) => {
  const [props, restOfProps] = splitProps(passedProps, ['children', 'class']);
  const navigate = useNavigate();

  const onToggleTheme = () => {
    applicationStore.toggleTheme();
  };

  const onLogout = () => {
    applicationStore.logout();
    navigate('/login');
  };

  createEffect(async () => {
    const cachedAuthenticationToken = localStorageCacheUtils.get(LOCAL_STORAGE_AUTHENTICATION_TOKEN_KEY);

    if (!cachedAuthenticationToken) {
      applicationStore.setAuthentication(false);

      return;
    }

    try {
      const response = await httpUtils.http(
        `${applicationUtils.getGlobalVariable(GlobalVariable.BASE_API_URL)}/authenticate/${cachedAuthenticationToken}`,
      );

      applicationStore.setAuthentication(response.status === 200);
    } catch (error) {
      applicationStore.setAuthentication(false);
    }
  });

  return (
    <div data-id="application-frame" class={classnames(styles.applicationFrame, props.class)} {...restOfProps}>
      {applicationStore.isAuthenticated() && <ApplicationFrameNavigation />}
      <div class={classnames(styles.subContainer)}>
        <Show when={applicationStore.isAuthenticated()}>
          <div data-id="header" class={classnames(styles.header)}>
            <div class={classnames(styles.headerLogo)}>LOGO TODO</div>
            <div class={classnames(styles.headerActions)} data-id="actions">
              <Button data-id="toggle-theme" context={ButtonContext.PRIMARY} onClick={onToggleTheme}>
                Toggle Theme (current: {applicationStore.theme()})
              </Button>
              <Button data-id="logout" context={ButtonContext.DANGER} onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </Show>
        <div class={classnames(styles.mainContent)}>
          <Suspense fallback={'Loading...'}>{props.children}</Suspense>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFrame;
