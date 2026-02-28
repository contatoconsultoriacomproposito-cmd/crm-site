import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata padrão (pode ser sobrescrita em cada [slug]/page.tsx depois)
export const metadata: Metadata = {
  title: "SeguroCRM - Seu site inteligente",
  description: "Cotações de seguros de forma rápida e inteligente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Aqui não precisamos mais de ThemeProvider nem fetch no layout */}
        {children}
      </body>
    </html>
  );
}