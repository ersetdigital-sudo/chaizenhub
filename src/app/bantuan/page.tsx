import type { Metadata } from "next";
import { BantuanClient } from "@/components/BantuanClient";

export const metadata: Metadata = {
  title: "Bantuan",
  description:
    "Cari jawaban soal QRIS, invoice, status pesanan, dan refund. Kalau belum ketemu, chat admin Chaizenhub langsung.",
};

export default function BantuanPage() {
  return <BantuanClient />;
}
