'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from './client';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { getProfile } from '../action/server';

interface Profile {
  id: string;
  user_name: string;
  avatar_url: string;
  created_at: string;
}

type ContextType = {
  supabase: SupabaseClient | null;
  user: User | null;
  profile: Profile | null;
}

const Context = createContext<ContextType>({
  supabase: null,
  user: null,
  profile: null,
});

export default function SupabaseProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        if (session?.user) {
          setUser(session.user);
          try {
            const profile = await getProfile();
            if (profile) {
              setProfile(profile);
            }
          } catch (error) {
            console.error('Failed to load profile:', error);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return <Context.Provider value={{ supabase, user, profile }}>{children}</Context.Provider>;
}

export const useSupabase = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }

  return context;
};