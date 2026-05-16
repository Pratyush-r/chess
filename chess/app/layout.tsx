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
      <body className={`${inter.variable} min-h-screen bg-gray-950 text-white flex flex-col`}>
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
                background: '#1f2937',
                color: '#f9fafb',
                border: '1px solid #374151',
                borderRadius: '12px',
              },
              success: { iconTheme: { primary: '#22c55e', secondary: '#1f2937' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#1f2937' } },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
