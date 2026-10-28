import Link from "next/link";
import Image from "next/image";
import {
  FaEnvelope,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";

const exploreLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Contact", href: "/contact" },
];

const contactLinks = [
  {
    name: "openengineering9@gmail.com",
    href: "mailto:openengineering9@gmail.com",
    Icon: FaEnvelope,
  },
  {
    name: "+91 94016 69266",
    href: "tel:+919401669266",
    Icon: FaPhoneAlt,
  },
];

const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/openengineeringworld",
    Icon: FaInstagram,
    hover: "hover:border-pink-400/40 hover:bg-pink-500/10 hover:text-pink-300",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/openengineeringworld",
    Icon: FaLinkedinIn,
    hover: "hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300",
  },
  {
    name: "WhatsApp Channel",
    href: "https://whatsapp.com/channel/0029Vb5J1mP3QxRwDLNrsh02",
    Icon: FaWhatsapp,
    hover: "hover:border-green-400/40 hover:bg-green-500/10 hover:text-green-300",
  },
];

const linkClass =
  "w-fit rounded text-gray-400 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60";

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-[#0a0a0a] text-gray-400">
      {/* Gradient hairline along the top edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent"
      />

      {/* Soft ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-80 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-purple-500/10 blur-[110px]"
      />

      <div className="mx-auto max-w-7xl px-6 pt-16 md:px-12">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link
              href="/"
              aria-label="Open Engineering home"
              className="inline-flex items-center gap-3 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60"
            >
              <Image
                src="/white-logo.png"
                alt=""
                width={44}
                height={44}
                className="h-10 w-auto object-contain"
              />
              <span className="text-xl font-semibold tracking-tight text-white">
                Open Engineering
              </span>
            </Link>

            <p className="mt-5 max-w-sm leading-7 text-gray-400">
              Making technology accessible for all.
            </p>

            <ul className="mt-7 flex items-center gap-3">
              {socials.map(({ name, href, Icon, hover }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${name} (opens in a new tab)`}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-gray-400 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60 ${hover}`}
                  >
                    <Icon aria-hidden="true" size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
            <h2 className="text-sm font-semibold text-white">Explore</h2>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {exploreLinks.map(({ name, href }) => (
                <li key={name}>
                  <Link href={href} className={linkClass}>
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="md:col-span-3">
            <h2 className="text-sm font-semibold text-white">Contact</h2>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {contactLinks.map(({ name, href, Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    className={`${linkClass} flex items-center gap-3 break-all`}
                  >
                    <Icon
                      aria-hidden="true"
                      size={13}
                      className="shrink-0 text-purple-300"
                    />
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Open Engineering. All rights reserved.</p>
        </div>
      </div>

      {/* Oversized wordmark that fades into the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none overflow-hidden px-6 text-center"
      >
        <p
          className="translate-y-[18%] whitespace-nowrap bg-gradient-to-b from-white/[0.12] to-transparent bg-clip-text text-[clamp(2.5rem,12vw,10rem)] font-bold leading-none tracking-tighter text-transparent"
        >
          Open Engineering
        </p>
      </div>
    </footer>
  );
}
