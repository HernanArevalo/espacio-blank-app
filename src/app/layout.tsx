import type { Metadata } from 'next'
import '@/app/globals.css'
import Navbar from '@/components/navbar'
import Providers from './providers'


export const metadata: Metadata = {
  title: {
    default: "ESPACIO BLANK",
    template: "%s | ESPACIO BLANK",
  },
  description: 'Espacio Blank',
  icons: "/favicon.ico"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col">
        <Providers>
          <ClientLayout>
          </ClientLayout>
        </Providers>
      </body>
    </html>
  )
}
