import Cookies from "js-cookie";

export type ConsentCategory = "necessary" | "functional" | "analytics" | "marketing";

export type ConsentState = Record<ConsentCategory, boolean>;

const CONSENT_KEY = "cookie_consent";

const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export function getConsent(): ConsentState | null {
  const raw = Cookies.get(CONSENT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONSENT, ...parsed };
  } catch {
    return null;
  }
}

export function saveConsent(state: ConsentState) {
  Cookies.set(CONSENT_KEY, JSON.stringify(state), {
    expires: 180,
    sameSite: "Lax",
  });
}

export function canUse(category: Exclude<ConsentCategory, "necessary">): boolean {
  const c = getConsent();
  if (!c) return false;
  return !!c[category];
}

export function clearNonEssential(keys: string[]) {
  keys.forEach((k) => Cookies.remove(k));
}
