"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, getToken } from "../utils/auth";

const AdminRoute = ({ children }) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/store");
      return;
    }

    setAuthorized(true);
  }, [router]);

  if (!authorized) return null;

  return children;
};

export default AdminRoute;