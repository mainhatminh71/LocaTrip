"use client";

import { useEffect } from "react";
import { getUserManager } from "@/lib/auth/user-manager";

/** Silent renew iframe target — must not run the full redirect sign-in callback. */
export default function AuthSilentPage() {
  useEffect(() => {
    void getUserManager()
      .signinSilentCallback()
      .catch((err) => {
        console.error("OIDC silent renew callback failed", err);
      });
  }, []);

  return null;
}
