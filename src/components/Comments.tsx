"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

export function Comments() {
  const { resolvedTheme } = useTheme();
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const theme = resolvedTheme === "dark" ? "github_dark" : "github_light";
    
    // 이미 로드된 giscus가 있다면 테마만 변경
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    if (iframe) {
      iframe.contentWindow?.postMessage(
        { giscus: { setConfig: { theme } } },
        'https://giscus.app'
      );
      return;
    }

    // 스크립트 삽입
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
      currentRef.innerHTML = ""; // 이전 스크립트가 있다면 제거
      currentRef.appendChild(script);
    }
  }, [resolvedTheme]);

  return <div className="mt-20 pt-10 border-t border-border-subtle" ref={commentsRef} />;
}
