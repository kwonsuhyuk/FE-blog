"use client";

import { useEffect, useState } from "react";
import { TocItem } from "@/src/lib/posts";

interface TOCProps {
  items: TocItem[];
}

export function TOC({ items }: TOCProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className="hidden xl:block fixed left-[calc(50%+440px)] top-32 w-64 max-h-[calc(100vh-160px)] overflow-y-auto no-scrollbar">
      <nav className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-light mb-4">On this page</p>
        <ul className="space-y-2 text-sm font-medium">
          {items.map((item) => (
            <li 
              key={item.id}
              style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
            >
              <a
                href={`#${item.id}`}
                className={`block transition-colors duration-200 ${
                  activeId === item.id 
                    ? "text-primary font-bold" 
                    : "text-text-light hover:text-text-muted"
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
