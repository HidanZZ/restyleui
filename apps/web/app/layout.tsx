import type { Metadata } from "next";
import {
  DM_Mono,
  Geist,
  Geist_Mono,
  IBM_Plex_Mono,
  Inter,
  Inter_Tight,
  JetBrains_Mono,
  Manrope,
  Newsreader,
} from "next/font/google";

import { kitScript, themeScript } from "@/components/site/head-scripts";
import { KitProvider } from "@/components/site/kit-context";
import "./globals.css";

// Website chrome fonts.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Free fonts that kits use directly or as fallbacks for paid originals.
// Kit theme.css files reference these variables. See docs/ARCHITECTURE.md.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], style: ["normal", "italic"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500", "600"] });
const dmMono = DM_Mono({ variable: "--font-dm-mono", subsets: ["latin"], weight: ["400", "500"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] });

const fontVariables = [
  geistSans,
  geistMono,
  inter,
  interTight,
  manrope,
  newsreader,
  plexMono,
  dmMono,
  jetbrainsMono,
]
  .map((font) => font.variable)
  .join(" ");

export const metadata: Metadata = {
  title: {
    default: "Restyle UI",
    template: "%s · Restyle UI",
  },
  description: "Design kits rebuilt from real websites, for you and your agents.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Theme and active kit are applied before the first paint, so neither flashes. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: kitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <KitProvider>{children}</KitProvider>
      </body>
    </html>
  );
}
