import { useEffect, useState } from "react";
import { getAdminSession, subscribeToAuthChanges } from "../lib/auth";

export function useAuthUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function syncUser() {
      setUser(getAdminSession());
      setLoading(false);
    }

    syncUser();
    const unsubscribe = subscribeToAuthChanges(syncUser);
    return () => unsubscribe();
  }, []);

  return { user, loading };
}
