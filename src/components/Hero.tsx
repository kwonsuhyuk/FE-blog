"use client";

import { motion } from "framer-motion";

interface HeroProps {
  line1: string;
  line2: string;
  line3: string;
  socialLinks: { label: string; href: string }[];
}

export function Hero({ line1, line2, line3, socialLinks }: HeroProps) {
  return (
    <section className="py-24 relative overflow-hidden border-b border-border-subtle bg-white/40 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-12 text-left">
        <div className="lg:col-span-8 z-10">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-5xl font-extralight tracking-tight mb-3 leading-tight text-text-main">
              {line1.split("").map((char, index) => (
                <motion.span key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.08, duration: 0.4 }}>
                  {char}
                </motion.span>
              ))}
            </h1>
            <h2 className="text-3xl md:text-5xl tracking-tight mb-3 leading-tight text-text-main">
              {line2.split("").map((char, index) => {
                const isReactChar = index >= 0 && index < 5; 
                return (
                  <motion.span key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (line1.length + index) * 0.08, duration: 0.4 }} className={isReactChar ? "font-black text-primary" : ""}>
                    {char}
                  </motion.span>
                );
              })}
            </h2>
            <h2 className="text-3xl md:text-5xl font-extralight tracking-tight leading-tight text-text-main">
              {line3.split("").map((char, index) => {
                const isEmphasized = index >= 4; 
                return (
                  <motion.span key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (line1.length + line2.length + index) * 0.08, duration: 0.4 }} className={isEmphasized ? "font-bold text-text-light" : ""}>
                    {char}
                  </motion.span>
                );
              })}
            </h2>
          </div>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: (line1.length + line2.length + line3.length) * 0.08, duration: 0.8 }} className="mt-10 h-1 w-12 bg-primary/60 rounded-full origin-left"></motion.div>
        </div>
        <div className="lg:col-span-4 flex flex-col items-end gap-5 z-10">
          {socialLinks.map((link, i) => (
            <motion.a 
              key={link.label} 
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 10 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 1.5 + (i * 0.1) }} 
              className="text-lg md:text-xl font-extralight text-text-light hover:text-primary transition-all tracking-tight"
            >
              {link.label}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
