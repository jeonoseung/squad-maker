import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/Container/QueryProvider";
import JotaiProvider from "@/Container/JotaiProvider";

export const metadata: Metadata = {
  title: "스쿼드 메이커",
  description: "스쿼드 메이커.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kor">
      <body className={"min-w-[1280px]"}>
      <QueryProvider>
        <JotaiProvider>
          {children}
        </JotaiProvider>
      </QueryProvider>
      </body>
    </html>
  );
}
