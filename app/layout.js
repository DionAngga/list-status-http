import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-sans",
});

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-display",
});

export const metadata = {
  title: "Status HTTP",
  description:
    "Referensi kode status HTTP: seluruh kode di registri IANA, plus kode tidak resmi yang sering muncul di nginx dan Cloudflare.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${barlow.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
