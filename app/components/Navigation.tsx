"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Bell, Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Contact", href: "/contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isNotificationActive = pathname?.startsWith("/notification");

  const isLinkActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/products") {
      return pathname === "/products" || pathname.startsWith("/products/") || pathname.startsWith("/secretary");
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenu = () => setMenuOpen(false);

  // Lock page scroll while the full-screen menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  // Close on Escape, and when the viewport grows to the desktop layout.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    const desktop = window.matchMedia("(min-width: 768px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* The nav stays above the overlay so the logo and close button remain visible */}
      <nav className="relative z-20 flex w-full items-center justify-between border-b border-white/5 bg-gray/80 px-4 py-4 backdrop-blur-md sm:px-8 lg:px-16 xl:px-24">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          aria-label="Open Engineering home"
          className="relative z-10 flex shrink-0 items-center"
        >
          <Image
            src="/white-logo.png"
            alt="Open Engineering logo"
            width={48}
            height={48}
            priority
            className={`h-10 w-auto object-contain sm:h-11 lg:h-12 ${
              menuOpen ? "hidden md:block" : "block"
            }`}
          />
          <Image
            src="/logo-purple.png"
            alt="Open Engineering logo"
            width={48}
            height={48}
            priority
            className={`h-10 w-auto object-contain sm:h-11 lg:h-12 ${
              menuOpen ? "block md:hidden" : "hidden"
            }`}
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-6 md:flex lg:gap-10">
          {navLinks.map((link) => {
            const isActive = isLinkActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`text-base font-mono transition-colors duration-200 lg:text-lg ${
                  isActive
                    ? "text-purple-400 font-semibold"
                    : "text-gray-300 hover:text-purple-400"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <Link
            href="/notification"
            aria-label="Notifications"
            aria-current={isNotificationActive ? "page" : undefined}
            className={`relative rounded-lg p-2 transition-colors ${
              isNotificationActive
                ? "bg-purple-500/10 text-purple-400 ring-1 ring-purple-400/50"
                : "text-gray-300 hover:bg-white/5 hover:text-purple-400"
            }`}
          >
            <Bell size={21} />

            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className={`group relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-white/10 hover:text-purple-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 md:hidden ${
            menuOpen ? "text-purple-400" : "text-gray-200"
          }`}
        >
          <span aria-hidden="true" className="relative block h-6 w-6">
            {/* Top line */}
            <span
              className={`absolute left-0 block h-[2px] w-6 rounded-full bg-current transition-all duration-300 ease-out motion-reduce:transition-none ${
                menuOpen ? "top-[11px] rotate-45" : "top-[7px]"
              }`}
            />
            {/* Bottom line */}
            <span
              className={`absolute left-0 block h-[2px] w-6 rounded-full bg-current transition-all duration-300 ease-out motion-reduce:transition-none ${
                menuOpen ? "top-[11px] -rotate-45" : "top-[15px]"
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile full-screen menu.
          Rendered outside <nav>: the nav's backdrop-blur would otherwise act as
          the containing block for `fixed` and trap the overlay inside the bar. */}
      <div
        id="mobile-navigation"
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-10 flex flex-col overflow-y-auto bg-black px-6 pb-10 pt-28 transition-opacity duration-300 motion-reduce:transition-none md:hidden ${
          menuOpen ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
      >
        {/* Soft purple glow to match the site background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/3 -z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-500/15 blur-[100px]"
        />

        <ul className="relative divide-y divide-white/10 border-y border-white/10">
          {navLinks.map((link) => {
            const isActive = isLinkActive(link.href);
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex items-center justify-between py-5 text-3xl font-semibold tracking-tight transition-colors focus:outline-none focus-visible:text-white focus-visible:ring-2 focus-visible:ring-purple-400/50 ${
                    isActive
                      ? "text-purple-400"
                      : "text-gray-200 hover:text-purple-400"
                  }`}
                >
                  {link.name}
                  <ArrowUpRight
                    aria-hidden="true"
                    size={24}
                    className={`transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none ${
                      isActive
                        ? "text-purple-400"
                        : "text-gray-600 group-hover:text-purple-400"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/notification"
          onClick={closeMenu}
          aria-current={isNotificationActive ? "page" : undefined}
          className={`relative mt-auto flex items-center gap-3 self-start rounded-xl border px-5 py-3.5 text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/50 ${
            isNotificationActive
              ? "border-purple-400/50 bg-purple-500/10 text-purple-400"
              : "border-white/10 bg-white/[0.04] text-gray-200 hover:bg-white/10 hover:text-purple-400"
          }`}
        >
          <Bell size={20} className={isNotificationActive ? "text-purple-400" : ""} />
          <span>Notifications</span>
          <span className="h-2 w-2 rounded-full bg-red-500" />
        </Link>
      </div>
    </header>
  );
}
