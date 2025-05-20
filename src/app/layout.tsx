import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Тренажер задач ЕГЭ Excel',
  description: 'Интерактивный тренажер для подготовки к заданиям ЕГЭ по Excel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
