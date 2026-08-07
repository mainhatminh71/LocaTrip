import type { User } from "oidc-client-ts";

export type AppRole = "admin" | "traveller";

type RealmAccess = { roles?: string[] };
type ResourceAccess = Record<string, { roles?: string[] }>;

function decodeJwtPayload(token: string | undefined): Record<string, unknown> | null {
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const json =
      typeof atob === "function"
        ? atob(part.replace(/-/g, "+").replace(/_/g, "/"))
        : Buffer.from(part, "base64url").toString("utf8");
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Parse Keycloak JWT / user profile → app role. */
export function roleFromClaims(claims: Record<string, unknown> | undefined | null): AppRole | null {
  if (!claims) return null;

  const realmRoles =
    (claims.realm_access as RealmAccess | undefined)?.roles ?? [];
  const clientId =
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "localtrip-app";
  const clientRoles =
    (claims.resource_access as ResourceAccess | undefined)?.[clientId]
      ?.roles ?? [];

  const roles = new Set(
    [...realmRoles, ...clientRoles].map((r) => String(r).toLowerCase()),
  );

  if (roles.has("admin")) return "admin";
  if (roles.has("traveller")) return "traveller";
  return null;
}

export function roleFromUser(user: User | null | undefined): AppRole | null {
  if (!user) return null;
  const fromAccess = roleFromClaims(decodeJwtPayload(user.access_token));
  if (fromAccess) return fromAccess;
  const profile = user.profile as Record<string, unknown> | undefined;
  return roleFromClaims(profile);
}

export function displayNameFromUser(user: User | null | undefined): string {
  if (!user?.profile) return "Tài khoản";
  const p = user.profile;
  return (
    p.name ||
    p.preferred_username ||
    p.email ||
    "Tài khoản"
  );
}
