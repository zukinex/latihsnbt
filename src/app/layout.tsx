import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LatihSNBT — Tryout SNBT Adaptif",
  description:
    "Latihan soal SNBT adaptif untuk pelajar Indonesia: drill cepat, tryout berwaktu, peta kelemahan, dan rencana latihan 7 hari. Soal dibuat AI lewat Firebase AI Logic.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
