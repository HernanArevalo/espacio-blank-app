import type { Metadata } from 'next';
import '@/app/globals.css';
import Navbar from '@/components/navbar';
import Providers from './providers';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: {
    default: "ESPACIO BLANK",
    template: "%s | ESPACIO BLANK",
  },

  description:
    "ESPACIO BLANK · Todas tus tiendas, en un solo lugar.",

  applicationName: "Espacio Blank",

  metadataBase: new URL("https://espacio-blank-app.vercel.app"),

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "ESPACIO BLANK",
    description:
      "Todas tus tiendas, en un solo lugar.",
    url: "https://espacio-blank-app.vercel.app",
    siteName: "Espacio Blank",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Espacio Blank",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ESPACIO BLANK",
    description:
      "Todas tus tiendas, en un solo lugar.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },

  category: "decoración",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1 min-h-0">
            {children}
            <Toaster />
          </main>
        </Providers>
      </body>
    </html>
  );
}
