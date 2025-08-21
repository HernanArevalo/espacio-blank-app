import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/navbar'
import Providers from './providers'


export const metadata: Metadata = {
  title: 'ESPACIO BLANK',
  description: 'Espacio Blank',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
