import type { Metadata, Viewport } from "next";
import "@fontsource-variable/mona-sans/wdth.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";
import { LangProvider } from "@/lib/lang";

const title = "Tan Keng Ting";
const description =
  "Software engineering undergraduate in Malaysia. Kotlin and Spring Boot on the server, React and Jetpack Compose on the client.";

export const metadata: Metadata = {
  metadataBase: new URL("https://jting904.github.io"),
  title,
  description,
  openGraph: { title, description, url: "https://jting904.github.io", siteName: title, type: "website" },
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#0C0D10"/><text x="32" y="44" font-family="Arial Black,Arial" font-size="30" font-weight="900" fill="#E9EAEC" text-anchor="middle">KT</text></svg>`,
          ),
      },
    ],
  },
};

export const viewport: Viewport = { themeColor: "#0C0D10", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
