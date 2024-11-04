import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Patent Infringement Check",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="bg-primary text-text text-center space-x-10 text-lx h-10 leading-10 absolute top-0 left-0 right-0">
          <Link
            href="/"
            className="inline-block h-full hover:bg-gray-600 px-4 rounded transition"
          >
            Patent Infringement Check
          </Link>
          <Link
            className="inline-block h-full hover:bg-gray-600 px-4 rounded transition"
            href="saved"
          >
            Saved Result
          </Link>
        </div>
        {children}
      </body>
    </html>
  );
}
