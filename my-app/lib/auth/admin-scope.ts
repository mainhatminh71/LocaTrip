import type { AppRole } from "@/lib/auth/roles";

export const ADMIN_HOME = "/admin/";

function isAdminPath(path: string | null | undefined): boolean {
  if (!path) return false;
  return path === "/admin" || path.startsWith("/admin/");
}

/** Paths admins may stay on (auth plumbing + admin UI). */
export function isAdminAllowedPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  if (isAdminPath(pathname)) return true;
  if (pathname.startsWith("/auth/callback")) return true;
  if (pathname.startsWith("/auth/silent")) return true;
  if (pathname === "/login" || pathname.startsWith("/login/")) return true;
  return false;
}

/** After OIDC login: admins always land on /admin; others keep returnTo. */
export function resolvePostLoginPath(
  role: AppRole | null | undefined,
  returnTo?: string | null,
): string {
  if (role === "admin") return ADMIN_HOME;
  if (returnTo?.startsWith("/")) {
    // Travellers never enter admin.
    if (role === "traveller" && isAdminPath(returnTo)) {
      return "/book-a-trip/";
    }
    return returnTo;
  }
  return "/book-a-trip/";
}
