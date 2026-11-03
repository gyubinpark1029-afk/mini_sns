import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase.js';

const AuthContext = createContext(null);

// 로그인한 사용자의 sns_users 프로필을 가져오고, 없으면 처음 로그인할 때 만들어 준다.
async function loadProfile(authUser) {
  const { data: found } = await supabase
    .from('sns_users')
    .select('*')
    .eq('auth_id', authUser.id)
    .maybeSingle();
  if (found) return found;

  const meta = authUser.user_metadata ?? {};
  const base = (authUser.email ?? 'reader').split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
  const { data } = await supabase
    .from('sns_users')
    .insert({
      auth_id: authUser.id,
      email: authUser.email,
      username: meta.username || `${base}_${Math.random().toString(36).slice(2, 6)}`,
      display_name: meta.display_name || meta.full_name || meta.name || base || '독자',
      avatar_url: meta.avatar_url ?? null,
    })
    .select()
    .single();
  return data ?? null;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) setIsLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (!next) {
        setProfile(null);
        setIsLoading(false);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // 인증 콜백 안에서 바로 DB를 부르면 교착이 생길 수 있어 별도 effect에서 프로필을 불러온다.
  const userId = session?.user?.id;
  useEffect(() => {
    if (!session?.user) return;
    loadProfile(session.user).then((p) => {
      setProfile(p);
      setIsLoading(false);
    });
  }, [userId]);

  const signOut = useCallback(() => supabase.auth.signOut(), []);
  const value = useMemo(
    () => ({ session, profile, setProfile, isLoading, signOut }),
    [session, profile, isLoading, signOut],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
