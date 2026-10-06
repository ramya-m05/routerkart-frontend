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
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  return children;
}

export default ProtectedRoute;