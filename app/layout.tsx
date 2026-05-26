import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agapay — Telehealth Platform",
  description: "Connect with doctors online, anytime.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}