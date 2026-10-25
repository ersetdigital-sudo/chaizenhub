import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Chaizenhub — Beranda">
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#930500" />
        <path
          d="M21.5 11.2A7 7 0 1 0 21.5 20.8"
          fill="none"
          stroke="#FFF8E7"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        <circle cx="23" cy="16" r="2.6" fill="#F3CFC9" />
      </svg>
      <span className="disp text-[1.35rem] font-extrabold tracking-tight">
        chaizenhub<span className="text-sangria">.</span>
      </span>
    </Link>
  );
}
