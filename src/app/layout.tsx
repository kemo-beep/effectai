import "../../styles/global.css";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "MotionForge - AI Motion Graphics Studio",
  description: "Create stunning motion graphics with AI. Type a prompt, get professional animations. Powered by Gemini AI and Remotion.",
  keywords: ["motion graphics", "AI", "video", "animation", "remotion", "gemini"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary-500/30 selection:text-primary-200">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-900/10 blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px] animate-pulse-slow delay-1000" />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
