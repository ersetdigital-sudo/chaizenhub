"use client";

import { useEffect, useState } from "react";

const words = ["ribet.", "antre.", "drama.", "lama."];

export function WordRotator() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("");

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    let timeout: ReturnType<typeof setTimeout> | undefined;
    const interval = setInterval(() => {
      setPhase("out");
      timeout = setTimeout(() => {
        setIndex((value) => (value + 1) % words.length);
        setPhase("in");
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setPhase(""));
        });
      }, 450);
    }, 2400);

    return () => {
      clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return (
    <span className="rot text-sangria">
      <span className={phase}>{words[index]}</span>
    </span>
  );
}
