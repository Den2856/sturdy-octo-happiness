import React, { useEffect, useState } from "react";
import { type ConsentState, getConsent, saveConsent, clearNonEssential } from "../../lib/cookie-consent";

type Props = {
  nonEssentialKeys?: string[];
};

const CookieConsent: React.FC<Props> = ({ nonEssentialKeys = ["movieData", "selectedSeats"] }) => {
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [state, setState] = useState<ConsentState>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const existing = getConsent();
    if (!existing) setOpen(true);
    else setState(existing);
  }, []);

  const acceptAll = () => {
    const next: ConsentState = { necessary: true, functional: true, analytics: true, marketing: true };
    saveConsent(next);
    setState(next);
    setOpen(false);
  };

  const onlyNecessary = () => {
    const next: ConsentState = { necessary: true, functional: false, analytics: false, marketing: false };
    saveConsent(next);
    clearNonEssential(nonEssentialKeys);
    setState(next);
    setOpen(false);
  };

  const rejectAll = () => {
    const next: ConsentState = { necessary: false, functional: false, analytics: false, marketing: false };
    saveConsent(next);
    clearNonEssential(nonEssentialKeys);
    setState(next);
    setOpen(false);
  };

  const saveCustom = () => {
    const next = { ...state, necessary: true };
    saveConsent(next);
    if (!next.functional || !next.analytics || !next.marketing) {
      clearNonEssential(nonEssentialKeys);
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div aria-live="polite" role="dialog" aria-modal="true" className="fixed inset-0 z-[1000]">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 animate-[fadeIn_.25s_ease-out_forwards]"
        style={{ animationDelay: "0ms" }}
      />
      {/* panel */}
      <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 pb-6">
        <div
          className="mx-auto max-w-3xl rounded-2xl border border-white/15 bg-neutral-900/95 text-white shadow-2xl
                     opacity-0 translate-y-6 animate-[slideUp_.32s_cubic-bezier(0.22,1,0.36,1)_forwards]"
        >
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0 mt-1 h-9 w-9 rounded-full bg-emerald-500/15 grid place-items-center">
                <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 21c-4.5-3-9-6-9-11a9 9 0 1 1 18 0c0 5-4.5 8-9 11z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">We use cookies</h3>
                <p className="mt-1 text-sm text-white/75">
                  We use cookies to run the site, improve analytics, and personalize content. You can reject them,
                  allow only necessary, or customize your preferences.
                </p>

                {!showSettings && (
                  <button
                    className="mt-3 text-sm text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
                    onClick={() => setShowSettings(true)}
                  >
                    Customize settings
                  </button>
                )}
              </div>
            </div>

            {showSettings && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Toggle
                  label="Functional"
                  caption="Remember selections (theaters, seats, etc.)"
                  checked={state.functional}
                  onChange={(v) => setState((s) => ({ ...s, functional: v }))}
                />
                <Toggle
                  label="Analytics"
                  caption="Help us understand and improve usage"
                  checked={state.analytics}
                  onChange={(v) => setState((s) => ({ ...s, analytics: v }))}
                />
                <Toggle
                  label="Marketing"
                  caption="Personalized offers and campaigns"
                  checked={state.marketing}
                  onChange={(v) => setState((s) => ({ ...s, marketing: v }))}
                />
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Necessary</div>
                      <div className="text-xs text-white/70">Required for the website to function</div>
                    </div>
                    <span className="px-2 py-1 text-[11px] rounded bg-white/10">On</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
              <button
                onClick={rejectAll}
                className="w-full sm:w-auto rounded-xl border border-white/20 px-4 py-2.5 text-sm hover:bg-white/10 transition"
              >
                Reject all
              </button>
              <button
                onClick={onlyNecessary}
                className="w-full sm:w-auto rounded-xl border border-white/20 px-4 py-2.5 text-sm hover:bg-white/10 transition"
              >
                Only necessary
              </button>
              {showSettings ? (
                <button
                  onClick={saveCustom}
                  className="w-full sm:w-auto rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-emerald-950 hover:bg-emerald-400 transition"
                >
                  Save settings
                </button>
              ) : (
                <button
                  onClick={acceptAll}
                  className="w-full sm:w-auto rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-emerald-950 hover:bg-emerald-400 transition"
                >
                  Allow all
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { to { opacity: 1 } }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
};

export default CookieConsent;

const Toggle: React.FC<{
  label: string;
  caption?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}> = ({ label, caption, checked, disabled = false, onChange }) => {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="grid grid-cols-[1fr_auto] items-center gap-3">
        <div>
          <div className="font-medium select-none">{label}</div>
          {caption && <div className="text-xs text-white/70 select-none">{caption}</div>}
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-disabled={disabled}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={[
            "relative h-7 w-12 rounded-full transition-colors outline-none",
            disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer focus-visible:ring-2 ring-emerald-400/60",
            checked ? "bg-emerald-500/80" : "bg-white/25",
          ].join(" ")}
        >
          <span
            className={[
              "absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow",
              "transition-transform will-change-transform",
              checked ? "translate-x-5" : "translate-x-0",
            ].join(" ")}
          />
        </button>
      </div>
    </div>
  );
};
