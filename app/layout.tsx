import Script from "next/script";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const font = Montserrat({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tariffario Trasporti CRI Muggiò",
  description: "Calcola velocemente la tariffa per un trasporto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${font.variable} antialiased`}>
        <header className="w-full text-center uppercase text-xl font-semibold py-2 text-white bg-red-600 shadow-xs">Calcolo tariffe trasporti</header>
        {children}
      </body>
    </html >
  );
}
