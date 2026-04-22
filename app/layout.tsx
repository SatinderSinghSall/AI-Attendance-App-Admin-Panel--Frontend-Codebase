import "./globals.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Sidebar (fixed) */}
        <Sidebar />

        {/* Main Content */}
        <main className="ml-64 min-h-screen bg-gray-50">
          <Header />

          <div className="p-6">{children}</div>
        </main>
      </body>
    </html>
  );
}
