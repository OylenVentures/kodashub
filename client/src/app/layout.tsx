import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_HOST_URI || "http://localhost:3000",
  ),
  title:
    "Kodas Hub - Support and Infrastructure Solutions for Web and Cloud Services",
  description:
    "Kodas Hub is a web and infrastructure support service that provides solutions for server, hosting, and DNS errors, as well as domain registration, cloud services, development, and DevOps solutions.",
  type: "website",
  keywords: [
    "Kodas Hub",
    "Web Support",
    "Infrastructure Solutions",
    "Server Errors",
    "Hosting Errors",
    "DNS Errors",
    "Domain Registration",
    "Cloud Services",
    "Development Solutions",
    "DevOps Solutions",
  ],
  authors: [
    { name: "Philip Oyelegbin", url: "https://philip.oyelegbin.name.ng" },
  ],
  openGraph: {
    title: "Kodas Hub - Instant Help for Server, Hosting & DNS Errors",
    description:
      "Kodas Hub offers web and infrastructure support, domain registration, cloud services, and DevOps solutions",
    url: process.env.NEXT_PUBLIC_HOST_URI,
    type: "website",
    locale: "en_US",
    images: "./opengraph-image.png",
    siteName: "Kodas Hub",
  },
  twitter: {
    handle: "@KodasHub",
    site: "@KodasHub",
    images: [`${process.env.NEXT_PUBLIC_HOST_URI}/opengraph-image.png`],
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
    icon: "./apple-touch-icon.png",
    shortcut: "/shortcut-icon.png",
    apple: "./apple-touch-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "./apple-touch-icon.png",
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-(--font-plus-jakarta-sans)">
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
