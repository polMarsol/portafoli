import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const bebasNeue = Bebas_Neue({ variable: "--font-bebas", weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pol Marsol – Software Developer · AI & ML",
  description: "Portfolio of Pol Marsol Torras, Software Developer specialised in AI and Machine Learning.",
  authors: [{ name: "Pol Marsol Torras" }],
  icons: {
    icon: [{ url: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon.svg`, type: "image/svg+xml", sizes: "any" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable}`}
    >
      <body suppressHydrationWarning className="min-h-screen antialiased overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
