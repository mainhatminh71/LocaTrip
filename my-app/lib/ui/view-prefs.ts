const BALANCE_VISIBLE_KEY = "locatrip.ui.balanceVisible";
const ROUTES_VISIBLE_KEY = "locatrip.ui.mapRoutesVisible";

function readBool(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    if (raw === "0" || raw === "false") return false;
    if (raw === "1" || raw === "true") return true;
    return fallback;
  } catch {
    return fallback;
  }
}

function writeBool(key: string, value: boolean) {
  try {
    localStorage.setItem(key, value ? "1" : "0");
  } catch {
    /* ignore quota / private mode */
  }
}

export function readBalanceVisible(): boolean {
  return readBool(BALANCE_VISIBLE_KEY, true);
}

export function writeBalanceVisible(visible: boolean) {
  writeBool(BALANCE_VISIBLE_KEY, visible);
}

export function readMapRoutesVisible(): boolean {
  return readBool(ROUTES_VISIBLE_KEY, true);
}

export function writeMapRoutesVisible(visible: boolean) {
  writeBool(ROUTES_VISIBLE_KEY, visible);
}
