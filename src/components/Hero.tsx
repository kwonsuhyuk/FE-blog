"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface HeroProps {
  line1: string;
  line3: string;
  socialLinks: { label: string; href: string }[];
}

export function Hero({ line1, line3, socialLinks }: HeroProps) {
  const keywords = ["코드", "사용자 경험", "기록", "개발 경험"];
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(200);

  useEffect(() => {
    const handleTyping = () => {
      const currentFullText = keywords[wordIndex];
      
      if (!isDeleting) {
        setDisplayText(currentFullText.substring(0, displayText.length + 1));
        setTypingSpeed(200);
        if (displayText === currentFullText) {
          setTimeout(() => setIsDeleting(true), 3000);
        }
      } else {
        setDisplayText(currentFullText.substring(0, displayText.length - 1));
        setTypingSpeed(150);
        if (displayText === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % keywords.length);
        }
      }
    };
    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, wordIndex, typingSpeed, keywords]);

  const getPostposition = (word: string) => {
    if (!word) return '';
    const lastChar = word.charCodeAt(word.length - 1);
    const isHangul = lastChar >= 0xac00 && lastChar <= 0xd7a3;
    if (!isHangul) return '를';
    const hasBatchim = (lastChar - 0xac00) % 28 > 0;
    return hasBatchim ? '을' : '를';
  };

  return (
    <section className="py-20 md:py-48 relative overflow-hidden bg-bg-main">
      {/* Subtle background blur for depth */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none dark:hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-12 text-left relative">
        <div className="lg:col-span-10 z-10">
          <div className="flex flex-col gap-3">
            <h1 className="text-xl md:text-4xl font-extralight tracking-tighter text-text-main leading-[1.1]">
              {line1}
            </h1>
            
            <div className="text-xl md:text-4xl font-black tracking-tighter text-text-main leading-[1.1] flex flex-wrap items-baseline gap-x-[0.2em]">
              <span className="whitespace-nowrap">더 나은</span>
              <div className="inline-flex items-baseline min-w-[1em]">
                <span className="text-primary">{displayText}</span>
                <span className="text-text-main ml-1">{getPostposition(displayText)}</span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-[2px] h-[0.8em] bg-primary ml-1 translate-y-[0.1em]"
                />
              </div>
              <span className="whitespace-nowrap text-text-main">위해 노력하는</span>
            </div>
            
            <h2 className="text-xl md:text-4xl font-extralight tracking-tighter text-text-muted/60 leading-[1.1]">
              {line3}
            </h2>
          </div>

          <motion.div 
            initial={{ scaleX: 0 }} 
            animate={{ scaleX: 1 }} 
            transition={{ delay: 1.2, duration: 1 }} 
            className="mt-12 h-[2px] w-20 bg-primary origin-left"
          />
        </div>

        <div className="lg:col-span-2 flex flex-col items-start lg:items-end gap-5 z-10 mt-12 lg:mt-0">
          {socialLinks.map((link, i) => (
            <motion.a 
              key={link.label} 
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 1.5 + (i * 0.1), duration: 0.6 }} 
              className="text-sm md:text-base font-black uppercase tracking-[0.2em] text-text-light hover:text-primary transition-all relative group whitespace-nowrap"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full" />
            </motion.a>
          ))}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <div className="w-[1px] h-16 bg-primary/20" />
      </motion.div>
    </section>
  );
}
