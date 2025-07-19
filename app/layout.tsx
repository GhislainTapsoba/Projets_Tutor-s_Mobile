import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DKT Solutions - Système de Gestion de Tickets",
  description: "Application moderne de gestion de files d'attente pour DKT Solutions",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">{children}</div>
      </body>
    </html>
  )
}
