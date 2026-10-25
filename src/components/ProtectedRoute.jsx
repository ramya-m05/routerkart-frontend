"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, getToken } from "../utils/auth";

function ProtectedRoute({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token || token === "undefined" || !user) {
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      router.replace("/login");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- auth gate: must set state in effect for SSR hydration
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  return children;
}

export default ProtectedRoute;