import { useMemo, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import MobileMenu from "./ui/MobileMenu";
import { press } from "./animations/SlideIn";
import logo from "/logo.png";

type User = { name?: string; email?: string };

const NAV_PUBLIC = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
];
const NAV_AUTH = [{ to: "/tickets", label: "My Ticket" }];

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const readToken = () =>
    localStorage.getItem("authToken") || localStorage.getItem("token") || "";

  const attachAuthHeader = () => {
    const t = readToken();
    if (t) axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    else delete axios.defaults.headers.common["Authorization"];
  };

  async function fetchUser() {
    try {
      attachAuthHeader();
      const { data } = await axios.get<User>("/api/auth/me");
      setUser(data);
      setIsAuthenticated(true);
    } catch {
      setUser({});
      setIsAuthenticated(false);
    }
  }

  useEffect(() => {
    fetchUser();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "authToken" || e.key === "token") fetchUser();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const MD = 768;
    const closeIfDesktop = () => window.innerWidth >= MD && setMenuOpen(false);
    closeIfDesktop();
    window.addEventListener("resize", closeIfDesktop);
    window.addEventListener("orientationchange", closeIfDesktop);
    const mq = window.matchMedia(`(min-width:${MD}px)`);
    const onChange = (e: MediaQueryListEvent) => e.matches && setMenuOpen(false);
    mq.addEventListener?.("change", onChange);
    return () => {
      window.removeEventListener("resize", closeIfDesktop);
      window.removeEventListener("orientationchange", closeIfDesktop);
      mq.removeEventListener?.("change", onChange);
    };
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const initials = useMemo(() => {
    if (!user?.name && !user?.email) return "U";
    const s = (user?.name || user?.email || "U").trim().split(" ");
    return ((s[0]?.[0] ?? "U") + (s[1]?.[0] ?? "")).toUpperCase();
  }, [user]);

  function logoutLocal() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
    setUser({});
    setMenuOpen(false);
  }

  const btnBase =
    "rounded-xl px-4 py-2 font-semibold transition " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]";

  return (
    <header className="sticky top-0 z-50 border-b border-outline-default/50 bg-background/85 backdrop-blur-md">
      <div className="mx-auto h-16 px-3 sm:px-4 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <img src={logo} alt="Cinemas" className="h-9 w-auto" />
        </Link>

        {/* Desktop nav: повторяем те же ссылки, что и в мобильном меню */}
        <nav className="hidden md:flex items-center gap-5 text-white/90">
          {NAV_PUBLIC.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-2 py-1 hover:bg-white/[0.07] hover:text-primary transition"
            >
              {l.label}
            </Link>
          ))}

          <span className="mx-1 h-5 w-px bg-white/10" />

          {isAuthenticated ? (
            <>
              {NAV_AUTH.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`${btnBase} bg-primary text-black hover:bg-btn-hover`}
                >
                  {l.label}
                </Link>
              ))}
              <motion.button
                {...press}
                onClick={logoutLocal}
                className={`${btnBase} bg-btn-red text-white hover:brightness-110`}
              >
                Logout
              </motion.button>
              <span className="ml-1 grid h-9 w-9 place-items-center rounded-lg bg-primary-weak text-primary text-sm font-bold">
                {initials}
              </span>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`${btnBase} bg-primary text-black hover:bg-btn-hover`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`${btnBase} border border-white/70 text-white hover:bg-white/10`}
              >
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Burger (mobile only) */}
        <motion.button
          {...press}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="md:hidden relative h-8 w-8 shrink-0 grid place-items-center rounded-lg hover:bg-white/5 transition"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {/* 3 bars -> X */}
          <span className={`absolute h-0.5 w-5 bg-white transition-transform duration-300 ${menuOpen ? "translate-y-0 rotate-45" : "-translate-y-[6px]"}`} />
          <span className={`absolute h-0.5 w-5 bg-white transition-opacity duration-200 ${menuOpen ? "opacity-0" : "opacity-100"}`} />
          <span className={`absolute h-0.5 w-5 bg-white transition-transform duration-300 ${menuOpen ? "translate-y-0 -rotate-45" : "translate-y-[6px]"}`} />
        </motion.button>
      </div>

      {/* Mobile drawer */}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        onLogout={logoutLocal}
        initials={initials}
        linksPublic={NAV_PUBLIC}
        linksAuthOnly={NAV_AUTH}
      />
    </header>
  );
}
