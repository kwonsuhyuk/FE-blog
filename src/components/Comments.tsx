"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

export function Comments() {
  const { theme } = useTheme();
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "kwonsuhyuk/FE-blog");
    script.setAttribute("data-repo-id", "R_kgDON8Inpw"); // This needs to be checked or provided by user
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDON8Inp84CnU_X"); // This needs to be checked or provided by user
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
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
  }, [theme]);

  return <div className="mt-20 pt-10 border-t border-border-subtle" ref={commentsRef} />;
}
