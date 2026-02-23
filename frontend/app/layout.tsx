import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Navbar } from "@/components/ui/navbar";

export const metadata: Metadata = {
  title: "Pakistan AI Real Estate Price Predictor",
  description: "AI-powered property pricing, ROI analytics, and market maps for Lahore and Karachi."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="app-shell">{children}</main>
      </body>
    </html>
  );
}
