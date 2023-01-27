import { createRoot, createSignal, batch } from 'solid-js';

import { applicationUtils, GlobalVariable } from '$/utils/application';
import { HttpMethod, httpUtils } from '$/utils/http';
import { localStorageCacheUtils } from '$/utils/local-storage-cache';
import { ThemeName } from '$/utils/styles';

export interface AuthenticateResponseData {
  authenticationToken: string;
}

export const LOCAL_STORAGE_AUTHENTICATION_TOKEN_KEY = 'authentication-token';

const createApplicationStore = () => {
  const [isLoading, setIsLoading] = createSignal<boolean>(true);
  const [redirectUrl, setRedirectUrl] = createSignal<string>('');
  // @todo refactor to use system theming by default
  const [theme, setTheme] = createSignal<ThemeName>(ThemeName.LIGHT);
  // @todo default to false once login is functional
  const [isAuthenticated, setIsAuthenticated] = createSignal<boolean>(false);

  const toggleTheme = () => {
    setTheme(theme() === ThemeName.LIGHT ? ThemeName.DARK : ThemeName.LIGHT);
  };

  const login = async () => {
    try {
      const response = await httpUtils.http(
        `${applicationUtils.getGlobalVariable(GlobalVariable.BASE_API_URL)}/authenticate`,
        { method: HttpMethod.POST, payload: {} },
      );
      const { authenticationToken } = await httpUtils.parseJson<AuthenticateResponseData>(response);

      localStorageCacheUtils.set(LOCAL_STORAGE_AUTHENTICATION_TOKEN_KEY, authenticationToken);

      batch(() => {
        setIsAuthenticated(true);
        setRedirectUrl('/home');
      });

      // @todo(feature) redirect to attempted original page
    } catch (error) {
      // @todo(!!!) error logging
      batch(() => {
        setIsAuthenticated(false);
        setRedirectUrl('/login');
      });
    }
  };

  const finishLogin = () => {
    setRedirectUrl('');
  };

  const logout = () => {
    localStorageCacheUtils.remove(LOCAL_STORAGE_AUTHENTICATION_TOKEN_KEY);

    batch(() => {
      setIsAuthenticated(false);
      setRedirectUrl('/login');
    });
  };

  const setAuthentication = (isAuthenticated: boolean) => {
    batch(() => {
      setIsAuthenticated(isAuthenticated);
      setIsLoading(false);
    });
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    isAuthenticated,
    login,
    finishLogin,
    redirectUrl,
    logout,
    setIsLoading,
    setAuthentication,
    isLoading,
  };
};

const applicationStore = createRoot(createApplicationStore);

export { applicationStore };
