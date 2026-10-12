import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { ComplaintProvider } from "@/components/complaint-provider";
import "./globals.css";

function metadataBase() {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: metadataBase(),
  title: {
    default: "CaseMeld — Complaint intelligence",
    template: "%s — CaseMeld",
  },
  description:
    "Turn customer complaints into clear categories, connected cases, and actionable next steps.",
  openGraph: {
    title: "CaseMeld — Complaint intelligence",
    description: "Connect complaints. Uncover patterns.",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "CaseMeld — Connect complaints. Uncover patterns." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CaseMeld — Complaint intelligence",
    description: "Connect complaints. Uncover patterns.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ComplaintProvider>
          <AppHeader />
          {children}
        </ComplaintProvider>
      </body>
    </html>
  );
}
