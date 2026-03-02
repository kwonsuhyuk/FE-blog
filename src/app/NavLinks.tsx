"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Posts", href: "/posts" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-8 text-sm font-bold">
      {links.map((link) => {
        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`transition-all duration-300 relative py-1 ${
              isActive ? "text-text-main" : "text-text-light hover:text-text-muted"
            }`}
          >
            {link.name}
            {isActive && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-in fade-in zoom-in duration-500" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
