"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  detectOperator,
  formatRupiah,
  normalizePhone,
  priceList,
  services,
} from "@/lib/catalog";

export function QuickTopup() {
  const router = useRouter();
  const [number, setNumber] = useState("");
  const [operator, setOperator] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const options = operator ? priceList(services.pulsa, operator).slice(0, 6) : [];
  const item = selected !== null ? options[selected] : null;
  const canContinue = !!operator && !!item && normalizePhone(number).length >= 10;

  function handleNumber(value: string) {
    setNumber(value);
    const detected = detectOperator(value);
    if (detected !== operator) {
      setOperator(detected);
      setSelected(null);
    }
  }

  function handleContinue() {
    if (!operator || !item) return;
    const params = new URLSearchParams({
      s: "pulsa",
      p: operator,
      i: item[0],
      n: number.replace(/\s/g, ""),
      a: String(item[1]),
    });
    router.push(`/bayar/?${params.toString()}`);
  }

  return (
    <div>
      <label htmlFor="quick-number" className="mb-2 block text-xs text-mute">
        Nomor HP
      </label>
      <div className="relative">
        <input
          id="quick-number"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="08xx xxxx xxxx"
          value={number}
          onChange={(event) => handleNumber(event.target.value)}
          className="inp w-full rounded-2xl px-5 py-4 pr-32 text-lg tracking-wide"
        />
        {operator ? (
          <span
            aria-live="polite"
            className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-full bg-sangria px-3 py-1.5 text-[11px] font-semibold text-white"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blush" />
            {operator}
          </span>
        ) : null}
      </div>

      {operator ? (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {options.map((option, index) => (
            <button
              key={option[0]}
              type="button"
              onClick={() => setSelected(index)}
              aria-pressed={selected === index}
              className={`opt rounded-xl py-2.5 text-sm ${selected === index ? "on" : ""}`}
            >
              <b className="block">{option[0]}</b>
              <span className="text-[11px] text-mute">{formatRupiah(option[1])}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-black/15 bg-cosmic px-4 py-3 text-xs text-mute">
          Ketik nomor HP, nominal muncul sesuai operatormu.
        </p>
      )}

      <button
        type="button"
        onClick={handleContinue}
        disabled={!canContinue}
        className="btn-sangria mt-5 w-full rounded-2xl py-4"
      >
        Lanjut
      </button>
      <p className="mt-3 text-center text-xs text-mute">
        Operator terdeteksi otomatis dari nomormu
      </p>
    </div>
  );
}
