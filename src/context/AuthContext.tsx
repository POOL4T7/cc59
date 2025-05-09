'use client';

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
} from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { SupabaseClient, User } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  supabase: SupabaseClient;
  loginUser: (email: string, password: string) => Promise<any>;
  logoutUser: () => Promise<void>;
  signupUser: (email: string, password: string) => Promise<any>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up session and listener
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching session:', error);
      }
      console.log(data);
      setUser(data.user ?? null);
      setIsLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    init();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const loginUser = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = async () => {
    setIsLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getUser();

      if (!sessionData.user) {
        console.warn('No session found, skipping logout');
        return;
      }

      const { error } = await supabase.auth.signOut();
      console.log('{ error }', { error });
      if (error) throw error;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signupUser = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return { data, error };
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        supabase,
        loginUser,
        logoutUser,
        signupUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
