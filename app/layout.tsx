import '../styles/globals.css'
import SmartlinkInitializer from '../components/smartlink/SmartlinkInitializer'
import { Analytics } from '@vercel/analytics/react'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <Analytics />
      <div className="w-full h-screen">
        <SmartlinkInitializer />
        {children}
      </div>
      </body>
    </html>
  )
}