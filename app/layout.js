import { ModeProvider } from "@/lib/mode-context";
import "./globals.css";

export const metadata = {
  title: "TDI Workspace",
  description: "TDI Workspace — interior design studio",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Manrope:wght@300;400;500;600;700;800&family=Noto+Serif+SC:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, background: "#221C15" }}>
        <ModeProvider>{children}</ModeProvider>
      </body>
    </html>
  );
}
