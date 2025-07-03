import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Block Grid - Puzzle Game',
  description: 'Um jogo de puzzle casual onde você encaixa peças em um tabuleiro 8×8 para completar linhas e colunas.',
  keywords: ['game', 'puzzle', 'block', 'grid', 'casual'],
  authors: [{ name: 'Block Grid Team' }],
  manifest: '/manifest.json',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
    { media: '(prefers-color-scheme: dark)', color: '#1e293b' }
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Block Grid',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Block Grid',
    title: 'Block Grid - Puzzle Game',
    description: 'Puzzle casual no estilo Block Blast! - encaixe peças em um tabuleiro 8×8',
  },
  twitter: {
    card: 'summary',
    title: 'Block Grid - Puzzle Game',
    description: 'Puzzle casual no estilo Block Blast! - encaixe peças em um tabuleiro 8×8',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Block Grid" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#0284c7" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        <ThemeProvider defaultTheme="system">
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
} 