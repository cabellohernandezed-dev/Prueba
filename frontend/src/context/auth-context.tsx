'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { apiFetch } from '@/lib/api';
import type { User } from '@/lib/types';

/**
 * Contexto de autenticación.
 *
 * Guarda los datos del usuario que ha iniciado sesión y permite
 * realizar acciones como iniciar sesión, registrarse y cerrar sesión.
 *
 * Al iniciar la aplicación, consulta al backend para comprobar
 * si existe una sesión activa. Mientras obtiene esa información,
 * `isLoading` permanece en `true`.
 */

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al cargar la app comprobamos si ya hay una sesión activa.
  useEffect(() => {
    apiFetch<{ user: User }>('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(data.user);
  }, []);

  const register = useCallback(
    async (nombre: string, email: string, password: string) => {
      const data = await apiFetch<{ user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ nombre, email, password }),
      });
      setUser(data.user);
    },
    [],
  );

  const logout = useCallback(async () => {
    await apiFetch('/auth/logout', { method: 'POST' });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook para consumir el contexto de autenticación desde cualquier componente. */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  }

  return context;
}
