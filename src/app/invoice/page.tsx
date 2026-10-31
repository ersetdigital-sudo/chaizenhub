import type { Metadata } from "next";
import { Suspense } from "react";
import { InvoiceClient } from "@/components/InvoiceClient";

export const metadata: Metadata = {
  title: "Cek Invoice",
  description: "Lacak status pesanan Chaizenhub dengan kode invoice CHZ-.",
};

export default function InvoicePage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" aria-hidden="true" />}>
      <InvoiceClient />
    </Suspense>
  );
}
