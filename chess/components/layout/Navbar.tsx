'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, BookOpen, Swords, Users, LayoutDashboard, Puzzle, Crown } from 'lucide-react';
import { cn } from '@/utils/cn';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
  { href: '/tutorial', label: 'Learn', icon: <BookOpen size={16} /> },
  { href: '/play/computer', label: 'vs Computer', icon: <Swords size={16} /> },
  { href: '/play/player', label: 'vs Player', icon: <Users size={16} /> },
  { href: '/puzzles', label: 'Puzzles', icon: <Puzzle size={16} /> },
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-gray-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="text-2xl"
            >
              ♛
            </motion.div>
            <span className="font-bold text-lg">
              <span className="text-white">Chess</span>
              <span className="text-primary-400">Master</span>
              <span className="hidden sm:inline text-gray-400 font-normal text-sm ml-1">Academy</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  pathname.startsWith(item.href)
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-gray-950/95"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    pathname.startsWith(item.href)
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
