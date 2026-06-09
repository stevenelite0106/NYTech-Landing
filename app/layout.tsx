import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Space of Mind — Join the Founding 100",
  description:
    "Space of Mind is a science-backed daily protocol that builds the mental patterns your next level demands, one rep at a time. Join as a founding member before we open to the public.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;450;500;600;700&family=Roboto:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
