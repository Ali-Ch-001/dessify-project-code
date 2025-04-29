'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

/**
 * Blocks rendering until we know the user is logged in.
 * If there's no session, immediately redirect to /sign-in.
 *
 */
export function useRequireAuth(): boolean {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/sign-in');
      } else {
        setReady(true);
      }
    });
  }, [router]);

  return ready;
}
