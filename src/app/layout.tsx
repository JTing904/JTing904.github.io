import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

const title = "Tan Keng Ting — Software Engineering Undergraduate";
const description =
  "Software engineering undergraduate in Malaysia building mobile and web apps in Kotlin, TypeScript and Python. Playable portfolio with a résumé mode.";

export const metadata: Metadata = {
  metadataBase: new URL("https://jting904.github.io"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://jting904.github.io",
    siteName: "Tan Keng Ting",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#101322"/><text x="32" y="43" font-family="monospace" font-size="34" font-weight="bold" fill="#8ef07a" text-anchor="middle">&gt;_</text></svg>`,
          ),
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#101322",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-mode="play" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
