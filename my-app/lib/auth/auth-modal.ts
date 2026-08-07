export const AUTH_MODAL_EVENT = "locatrip:open-auth";

export type AuthModalOpenDetail = {
  next?: string;
  mode?: "signin" | "signup" | null;
  error?: string | null;
};

/** Open the global auth popup from non-React code (e.g. apiFetch). */
export function requestAuthModal(detail: AuthModalOpenDetail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<AuthModalOpenDetail>(AUTH_MODAL_EVENT, { detail }),
  );
}
