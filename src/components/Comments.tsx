"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

export function Comments() {
  const { resolvedTheme } = useTheme();
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "kwonsuhyuk/FE-blog");
    script.setAttribute("data-repo-id", "R_kgDON8Inpw");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDON8Inp84CnU_X");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", resolvedTheme === "dark" ? "dark" : "light");
    script.setAttribute("data-lang", "ko");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    const currentRef = commentsRef.current;
    if (currentRef) {
      currentRef.appendChild(script);
    }

    return () => {
      if (currentRef) {
        currentRef.innerHTML = "";
      }
    };
  }, [resolvedTheme]);

  return <div className="mt-20 pt-10 border-t border-border-subtle" ref={commentsRef} />;
}
