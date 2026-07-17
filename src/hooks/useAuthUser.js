import { useEffect, useState } from "react";
import { subscribeToAuthChanges } from "../lib/auth";

export function useAuthUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function syncUser(nextUser) {
      setUser(nextUser || null);
      setLoading(false);
    }
    const unsubscribe = subscribeToAuthChanges(syncUser);
    return () => unsubscribe();
  }, []);

  return { user, loading };
}
