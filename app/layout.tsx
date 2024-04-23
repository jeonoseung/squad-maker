import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/Container/QueryProvider";
import JotaiProvider from "@/Container/JotaiProvider";

export const metadata: Metadata = {
  title: "OSEUNG 포트폴리오",
  description: "JeonOSeung의 포트폴리오 입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <QueryProvider>
        <JotaiProvider>
          {children}
        </JotaiProvider>
      </QueryProvider>
      </body>
    </html>
  );
}
