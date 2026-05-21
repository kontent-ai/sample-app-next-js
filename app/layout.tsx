import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import SmartlinkInitializer from "../components/smartlink/SmartlinkInitializer.tsx";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Analytics />
        <div className="w-full h-screen">
          <SmartlinkInitializer />
          {children}
        </div>
      </body>
    </html>
  );
}
