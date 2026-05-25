import { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pp_user')) || null; }
    catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('pp_token') && !user) {
      authApi.profile().then((d) => {
        setUser(d.user);
        localStorage.setItem('pp_user', JSON.stringify(d.user));
      }).catch(() => {});
    }
  }, []); // eslint-disable-line

  const persist = (data) => {
    localStorage.setItem('pp_token', data.token);
    localStorage.setItem('pp_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (creds) => {
    setLoading(true);
    try { const d = await authApi.login(creds); persist(d); return d.user; }
    finally { setLoading(false); }
  };

  const register = async (data) => {
    setLoading(true);
    try { const d = await authApi.register(data); persist(d); return d.user; }
    finally { setLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem('pp_token');
    localStorage.removeItem('pp_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);