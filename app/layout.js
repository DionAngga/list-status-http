import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata = {
  title: "Status HTTP",
  description:
    "Referensi kode status HTTP: seluruh kode di registri IANA, plus kode tidak resmi yang sering muncul di nginx dan Cloudflare.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${fraunces.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
