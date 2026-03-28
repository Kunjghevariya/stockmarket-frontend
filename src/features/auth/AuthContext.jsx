import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  clearStoredAccessToken,
  getStoredAccessToken,
  setStoredAccessToken,
} from '../../shared/api/client';
import {
  fetchCurrentUser,
  loginUser,
  loginWithDemoAccount,
  logoutUser,
  registerUser,
} from './api/authApi';

const AuthContext = createContext(null);

function normalizeAuthPayload(payload) {
  return {
    accessToken: payload?.accessToken || null,
    refreshToken: payload?.refreshToken || null,
    user: payload?.user || null,
    demoCredentials: payload?.demoCredentials || null,
  };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredAccessToken());
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(() => (getStoredAccessToken() ? 'loading' : 'anonymous'));
  const [demoCredentials, setDemoCredentials] = useState(null);

  const clearSession = useCallback(() => {
    clearStoredAccessToken();
    setToken(null);
    setUser(null);
    setDemoCredentials(null);
    setStatus('anonymous');
  }, []);

  const applySession = useCallback((payload) => {
    const session = normalizeAuthPayload(payload);
    setStoredAccessToken(session.accessToken);
    setToken(session.accessToken);
    setUser(session.user);
    setDemoCredentials(session.demoCredentials);
    setStatus('authenticated');
    return session;
  }, []);

  const bootstrapSession = useCallback(async () => {
    if (!token) {
      setStatus('anonymous');
      return;
    }

    setStatus('loading');

    try {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
      setStatus('authenticated');
    } catch (error) {
      console.error('Failed to restore session', error);
      clearSession();
    }
  }, [clearSession, token]);

  useEffect(() => {
    bootstrapSession();
  }, [bootstrapSession]);

  useEffect(() => {
    const syncSession = () => {
      const nextToken = getStoredAccessToken();
      setToken(nextToken);
      if (!nextToken) {
        setUser(null);
        setStatus('anonymous');
      }
    };

    window.addEventListener('storage', syncSession);
    return () => window.removeEventListener('storage', syncSession);
  }, []);

  const signIn = useCallback(
    async (credentials) => {
      const payload = await loginUser(credentials);
      return applySession(payload);
    },
    [applySession]
  );

  const signInWithDemo = useCallback(async () => {
    const payload = await loginWithDemoAccount();
    return applySession(payload);
  }, [applySession]);

  const signUp = useCallback((payload) => registerUser(payload), []);

  const signOut = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Failed to log out cleanly', error);
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({
      token,
      user,
      status,
      demoCredentials,
      isAuthenticated: status === 'authenticated',
      signIn,
      signInWithDemo,
      signUp,
      signOut,
      clearSession,
      setUser,
    }),
    [clearSession, demoCredentials, signIn, signInWithDemo, signOut, signUp, status, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return value;
}
