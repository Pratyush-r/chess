'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, BookOpen, Swords, Users, LayoutDashboard, Puzzle } from 'lucide-react';
import { cn } from '@/utils/cn';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
  { href: '/tutorial',      label: 'Learn',       icon: <BookOpen size={14} /> },
  { href: '/play/computer', label: 'vs Computer',  icon: <Swords size={14} /> },
  { href: '/play/player',   label: 'vs Player',    icon: <Users size={14} /> },
  { href: '/puzzles',       label: 'Puzzles',      icon: <Puzzle size={14} /> },
  { href: '/dashboard',     label: 'Dashboard',    icon: <LayoutDashboard size={14} /> },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-[#080b14]/80 backdrop-blur-xl border-b border-white/[0.04]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 20, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="text-2xl leading-none"
            >
              ♛
            </motion.div>
            <span className="font-bold text-[15px] tracking-tight">
              <span className="text-white">Chess</span>
              <span className="text-gradient font-black">Master</span>
            </span>
          </Link>

          {/* Desktop nav — pill style */}
          <div className="hidden md:flex items-center gap-0.5 bg-white/[0.04] border border-white/[0.06] rounded-full px-1.5 py-1.5 backdrop-blur-sm">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-150',
                      active
                        ? 'bg-emerald-500/15 text-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.2)]'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                    )}
                  >
                    <span className={cn('transition-colors', active ? 'text-emerald-400' : 'text-gray-500')}>
                      {item.icon}
                    </span>
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-dot"
                        className="w-1 h-1 rounded-full bg-emerald-400"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
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
            className="relative md:hidden border-t border-white/[0.04] bg-[#080b14]/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-0.5">
              {NAV_ITEMS.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                      active
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
