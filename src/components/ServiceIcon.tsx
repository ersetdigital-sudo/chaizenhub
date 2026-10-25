import type { ReactNode } from "react";
import type { Slug } from "@/lib/catalog";

const paths: Record<Slug, ReactNode> = {
  pulsa: (
    <>
      <rect x="7" y="2" width="10" height="20" rx="2.5" />
      <path d="M11 18h2" />
    </>
  ),
  "paket-data": <path d="M4 20V14M9 20V10M14 20V6M19 20V3" />,
  "e-wallet": (
    <>
      <rect x="3" y="6" width="18" height="14" rx="3" />
      <path d="M3 10h18M16 15h2" />
    </>
  ),
  pln: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  pdam: <path d="M12 3s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12z" />,
  "tv-internet": (
    <>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 21h8" />
    </>
  ),
  game: (
    <path d="M6 9h12a4 4 0 0 1 3.8 5.3l-.8 2.4a2.5 2.5 0 0 1-4.3.7L15 16H9l-1.7 1.4a2.5 2.5 0 0 1-4.3-.7l-.8-2.4A4 4 0 0 1 6 9zM8 12v3M6.5 13.5h3" />
  ),
  bpjs: (
    <>
      <path d="M12 21s-8-4.5-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 6.5-8 11-8 11z" />
      <path d="M12 9v5M9.5 11.5h5" />
    </>
  ),
  multifinance: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9h10M7 13h6" />
    </>
  ),
};

export function ServiceIcon({
  slug,
  className = "h-6 w-6",
}: {
  slug: Slug;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[slug]}
    </svg>
  );
}
