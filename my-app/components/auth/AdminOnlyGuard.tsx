"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { roleFromUser } from "@/lib/auth/roles";
import {
  ADMIN_HOME,
  isAdminAllowedPath,
} from "@/lib/auth/admin-scope";

/**
 * Admins may only use /admin (+ auth callback/login). Any other route
 * redirects straight to the admin home.
 */
export function AdminOnlyGuard({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const role = roleFromUser(auth.user);

  useEffect(() => {
    if (auth.isLoading || !auth.isAuthenticated) return;
    if (role !== "admin") return;
    if (isAdminAllowedPath(pathname)) return;
    router.replace(ADMIN_HOME);
  }, [auth.isLoading, auth.isAuthenticated, role, pathname, router]);

  const blockingAdmin =
    !auth.isLoading &&
    auth.isAuthenticated &&
    role === "admin" &&
    !isAdminAllowedPath(pathname);

  if (blockingAdmin) {
    return null;
  }

  return <>{children}</>;
}
