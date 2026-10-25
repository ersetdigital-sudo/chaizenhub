import { operatorLogos } from "@/lib/catalog";

export function ProviderAvatar({ name }: { name: string }) {
  const logo = operatorLogos[name];

  if (logo) {
    return (
      <img
        src={logo}
        alt=""
        width={24}
        height={24}
        className="h-5 w-5 object-contain"
        loading="lazy"
      />
    );
  }

  const initials = name
    .replace(/[^A-Za-z0-9 ]/g, "")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return <span className="text-xs font-bold">{initials}</span>;
}
