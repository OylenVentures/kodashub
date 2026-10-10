import { Fira_Code, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_HOST_URI || "http://localhost:3000",
  ),
  title: "KodasHub - Domain Registrar, Cloud & DevOps Services",
  description:
    "KodasHub offers domain registration, cloud services, and DevOps solutions",
  favicon: "../../public/favicon.ico",
  type: "website",
  author: "KodasHub",
  openGraph: {
    title: "KodasHub - Domain Registrar, Cloud & DevOps Services",
    description:
      "KodasHub offers domain registration, cloud services, and DevOps solutions",
    url: process.env.NEXT_PUBLIC_HOST_URI,
    type: "website",
    locale: "en_US",
    images: "../../public/android-chrome-512x512.png",
    site_name: "KodasHub",
  },
  twitter: {
    handle: "@kodashub",
    site: "@kodashub",
    images: "../../public/android-chrome-512x512.png",
    cardType: "summary_large_image",
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "../../public/apple-touch-icon.png",
    shortcut: "/shortcut-icon.png",
    apple: "../../public/apple-touch-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "../../public/apple-touch-icon.png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} ${firaCode.variable} font-sans min-h-screen flex flex-col`}
      >
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
