import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'ChessMaster Academy — Learn, Play, Master Chess',
  description: 'The most interactive chess learning platform. Learn from beginner to advanced with guided lessons, puzzles, and AI opponents.',
  keywords: ['chess', 'learn chess', 'chess tutorial', 'chess lessons', 'chess puzzles', 'play chess online'],
  openGraph: {
    title: 'ChessMaster Academy',
    description: 'Master chess with interactive lessons, puzzles, and AI play.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} min-h-screen bg-[#080b14] text-white flex flex-col`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Navbar />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#0e1422',
                color: '#f1f5f9',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px',
                fontSize: '14px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              },
              success: { iconTheme: { primary: '#4ade80', secondary: '#0e1422' } },
              error: { iconTheme: { primary: '#f87171', secondary: '#0e1422' } },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
