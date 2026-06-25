import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/blog", label: "Insights" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 sm:px-6 py-3 transition-all duration-500 ${
            scrolled ? "glass-strong" : "border border-transparent"
          }`}
        >
          <Link
            to="/"
            data-testid="nav-logo"
            className="flex items-center gap-2 group"
          >
            <span className="relative inline-flex h-7 w-7 items-center justify-center">
              <span className="absolute inset-0 rounded-md bg-gradient-to-br from-electric via-royal to-violetx blur-[6px] opacity-60 group-hover:opacity-90 transition-opacity" />
              <span className="relative inline-block h-5 w-5 rounded-[6px] bg-gradient-to-br from-white to-platinum/70" />
            </span>
            <span className="font-display text-[1.05rem] sm:text-lg font-bold tracking-tight">
              FILINEX
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                data-testid={`nav-link-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm rounded-full transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-white/60 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-white/10 border border-white/10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              data-testid="nav-cta-contact"
              className="hidden sm:inline-flex btn-magnet relative items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium bg-white text-black hover:bg-platinum transition-colors"
            >
              Start a Project
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emeraldx animate-pulse" />
            </Link>
            <button
              data-testid="nav-mobile-toggle"
              className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full glass"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden mx-auto max-w-7xl px-5 sm:px-8 mt-3"
          >
            <div className="glass-strong rounded-2xl p-4 flex flex-col gap-1">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  data-testid={`nav-mobile-${item.label.toLowerCase()}`}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm ${
                      isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/contact"
                data-testid="nav-mobile-cta"
                className="mt-2 block text-center rounded-xl bg-white text-black px-4 py-3 text-sm font-medium"
              >
                Start a Project →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
