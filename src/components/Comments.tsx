"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

export function Comments() {
  const { resolvedTheme } = useTheme();
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 테마가 결정되지 않았으면 아무것도 하지 않음
    if (!resolvedTheme) return;

    const theme = resolvedTheme === "dark" ? "dark" : "light";
    
    // 기존 내용을 깨끗이 비우고 시작
    if (commentsRef.current) {
      commentsRef.current.innerHTML = "";
    }

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "kwonsuhyuk/FE-blog");
    script.setAttribute("data-repo-id", "R_kgDORbdqHQ");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDORbdqHc4C3gq3");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", theme);
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

  return (
    <div 
      className="mt-20 pt-10 border-t border-border-subtle min-h-[300px]" 
      ref={commentsRef} 
      key={resolvedTheme} // 테마가 바뀔 때마다 div 자체를 새로 그려서 안전하게 재로드
    />
  );
}
