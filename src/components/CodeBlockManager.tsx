"use client";

import { useEffect } from "react";

export function CodeBlockManager() {
  useEffect(() => {
    const codeBlocks = document.querySelectorAll("pre");

    codeBlocks.forEach((block) => {
      // Check if button already exists
      if (block.querySelector(".copy-button")) return;

      block.style.position = "relative";
      
      const button = document.createElement("button");
      button.className = "copy-button absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/50 hover:text-white transition-all text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100";
      button.innerHTML = "Copy";
      
      // Add group class to pre for hover effect
      block.classList.add("group");

      button.addEventListener("click", async () => {
        const code = block.querySelector("code")?.innerText || "";
        try {
          await navigator.clipboard.writeText(code);
          button.innerHTML = "Copied!";
          button.classList.add("text-primary");
          setTimeout(() => {
            button.innerHTML = "Copy";
            button.classList.remove("text-primary");
          }, 2000);
        } catch (err) {
          console.error("Failed to copy!", err);
        }
      });

      block.appendChild(button);
    });
  }, []);

  return null;
}
