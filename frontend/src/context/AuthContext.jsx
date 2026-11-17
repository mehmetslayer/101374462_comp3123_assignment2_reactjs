import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { TOKEN_KEY, USERNAME_KEY } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // read from localStorage so the session survives a page refresh
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [username, setUsername] = useState(() => localStorage.getItem(USERNAME_KEY));
  const [expired, setExpired] = useState(false);

  const login = useCallback((newToken, name) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USERNAME_KEY, name);
    setToken(newToken);
    setUsername(name);
    setExpired(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    setToken(null);
    setUsername(null);
  }, []);

  // the axios interceptor fires this event when the backend rejects the token
  useEffect(() => {
    const onExpired = () => {
      logout();
      setExpired(true);
    };
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, [logout]);

  const value = { token, username, isAuthenticated: Boolean(token), expired, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);