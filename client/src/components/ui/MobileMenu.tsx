import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Sphere, OrbitControls } from "@react-three/drei";
import { overlay, drawer, pop, press } from "../animations/SlideIn";

type LinkItem = { to: string; label: string };

type Props = {
  open: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  initials?: string;
  linksPublic: LinkItem[];
  linksAuthOnly: LinkItem[];
};

const MobileMenu = ({
  open,
  onClose,
  isAuthenticated,
  onLogout,
  initials = "U",
  linksPublic,
  linksAuthOnly,
}: Props) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isDarkMode] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);


  const Nav = ({ items, onItem }: { items: LinkItem[]; onItem?: () => void }) => (
    <ul className="space-y-3">
      {items.map((l) => (
        <motion.li key={l.to} variants={pop} initial="initial" animate="animate" exit="exit">
          <Link
            to={l.to}
            onClick={() => onItem?.()}
            className="block rounded-lg px-5 py-3 text-white hover:bg-white/[0.06] hover:text-primary transition duration-300 ease-in-out"
          >
            {l.label}
          </Link>
        </motion.li>
      ))}
    </ul>
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay with smooth fade-in effect */}
          <motion.button
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={onClose}
            variants={overlay}
            initial="initial"
            animate="animate"
            exit="exit"
          />

          {/* Sliding menu with animation */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            className="fixed right-0 top-0 z-50 h-screen w-[min(92vw,360px)] bg-gray-800 border-l border-outline-default/50
                       shadow-[0_10px_40px_rgba(0,0,0,0.45)] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
            variants={drawer}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-16 bg-gray-800 text-white">
              <motion.span variants={pop} initial="initial" animate="animate" className="text-xl font-bold">
                Menu
              </motion.span>
              <motion.button
                {...press}
                onClick={onClose}
                className="rounded-lg px-3 py-1 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Close
              </motion.button>
            </div>

            {/* Main content */}
            <motion.nav
              className="px-4 py-6 space-y-4 bg-background"
              variants={pop}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {isAuthenticated ? (
                <>
                  <div className="mb-4 flex items-center gap-3 text-white">
                    <span className="grid h-12 w-12 place-items-center rounded-lg bg-primary-weak text-primary text-sm font-bold">
                      {initials}
                    </span>
                    <span>Welcome back!</span>
                  </div>

                  <Nav items={linksPublic} onItem={onClose} />
                  <Nav items={linksAuthOnly} onItem={onClose} />

                  <div className="my-4 h-px w-full bg-white/10" />

                  <motion.button
                    {...press}
                    onClick={onLogout}
                    className="w-full inline-flex items-center justify-center rounded-xl px-4 py-3 bg-btn-red text-white font-semibold hover:brightness-110 transition"
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <Nav items={linksPublic} onItem={onClose} />

                  <div className="my-4 h-px w-full bg-white/10" />

                  <div className="grid grid-cols-2 gap-2">
                    <motion.div {...press}>
                      <Link
                        to="/login"
                        onClick={onClose}
                        className="block text-center rounded-xl px-5 py-3 bg-primary text-black font-semibold hover:bg-btn-hover transition"
                      >
                        Login
                      </Link>
                    </motion.div>
                    <motion.div {...press}>
                      <Link
                        to="/register"
                        onClick={onClose}
                        className="block text-center rounded-xl px-5 py-3 border border-white/70 text-white font-semibold hover:bg-white/10 transition"
                      >
                        Register
                      </Link>
                    </motion.div>
                  </div>
                </>
              )}
            </motion.nav>
          </motion.div>

          <div className="absolute top-0 left-0 z-0 w-full h-full">
            <Canvas>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} />
              <Sphere args={[2, 16, 16]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#4e4e4e" />
              </Sphere>
              <OrbitControls />
            </Canvas>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
