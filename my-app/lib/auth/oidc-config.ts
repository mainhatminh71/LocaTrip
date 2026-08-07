/** Browser-safe Keycloak OIDC settings for localtrip-app (public + PKCE). */

export function getAppOrigin(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export function getKeycloakAuthority(): string {
  const base = (
    process.env.NEXT_PUBLIC_KEYCLOAK_URL || "https://auth.locatrip.app"
  ).replace(/\/$/, "");
  const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "localtrip";
  return `${base}/realms/${realm}`;
}

export function getKeycloakClientId(): string {
  return process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "localtrip-app";
}

export function getOidcConfig() {
  const authority = getKeycloakAuthority();
  const origin = getAppOrigin();
  return {
    authority,
    client_id: getKeycloakClientId(),
    redirect_uri: `${origin}/auth/callback`,
    post_logout_redirect_uri: `${origin}/`,
    // Dedicated silent page — must not share /auth/callback (request_type clash).
    silent_redirect_uri: `${origin}/auth/silent`,
    response_type: "code" as const,
    scope: "openid profile email",
    automaticSilentRenew: true,
    // Roles/name come from the access/id token — skip extra /userinfo round-trip.
    loadUserInfo: false,
  };
}
