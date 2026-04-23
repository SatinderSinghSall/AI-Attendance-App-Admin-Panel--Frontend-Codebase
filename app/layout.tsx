import "./globals.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Sidebar />

        <main className="ml-64 min-h-screen bg-gray-50">
          <Header />

          <div className="p-6">{children}</div>
        </main>

        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
