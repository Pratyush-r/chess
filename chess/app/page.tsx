'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen, Swords, Users, Zap, Star,
  ChevronRight, Brain, TrendingUp, Puzzle,
  ArrowRight, Shield, BarChart2, Clock,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useUserStore } from '@/store/userStore';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.21, 1.02, 0.73, 1] },
});

const FEATURES = [
  {
    icon: <BookOpen size={20} />,
    title: 'Interactive Lessons',
    description: 'Step-by-step guided lessons with real-time move validation and AI coaching.',
    accent: 'emerald',
  },
  {
    icon: <Brain size={20} />,
    title: 'AI Coach',
    description: 'Instant explanations for every mistake — in plain language, not jargon.',
    accent: 'violet',
  },
  {
    icon: <Swords size={20} />,
    title: 'Play vs Computer',
    description: 'Stockfish at 5 difficulty levels. Full move analysis after every game.',
    accent: 'blue',
  },
  {
    icon: <Users size={20} />,
    title: 'Multiplayer',
    description: 'Local or online games with room codes, live clocks, and chat.',
    accent: 'amber',
  },
  {
    icon: <Puzzle size={20} />,
    title: 'Daily Puzzles',
    description: '1 000+ tactical puzzles to sharpen pattern recognition.',
    accent: 'emerald',
  },
  {
    icon: <TrendingUp size={20} />,
    title: 'Progress Tracking',
    description: 'XP, ratings, streaks and achievements to keep you motivated.',
    accent: 'violet',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah K.',
    title: 'Club Player · 1450 rated',
    text: 'Went from 900 to 1450 in three months. The interactive lessons actually explain the *why*, not just the moves.',
    avatar: '👩',
  },
  {
    name: 'Marcus T.',
    title: 'Tournament Player · 1820 rated',
    text: 'Best tactical puzzle UI I\'ve used. The AI analysis after each game is genuinely useful, not hand-wavy.',
    avatar: '🧔',
  },
  {
    name: 'Emma L.',
    title: 'Complete Beginner · 850 rated',
    text: 'Zero chess knowledge two weeks ago. Now I beat my dad consistently and actually understand why.',
    avatar: '👧',
  },
];

const accentConfig: Record<string, string> = {
  emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
  violet:  'border-violet-500/20 bg-violet-500/10 text-violet-400',
  blue:    'border-blue-500/20 bg-blue-500/10 text-blue-400',
  amber:   'border-amber-500/20 bg-amber-500/10 text-amber-400',
};

// Mini chessboard preview for hero
const BOARD_PREVIEW = [
  ['r','n','b','q','k','b','n','r'],
  ['p','p','p','p','_','p','p','p'],
  ['_','_','_','_','_','_','_','_'],
  ['_','_','_','_','p','_','_','_'],
  ['_','_','_','_','P','_','_','_'],
  ['_','_','N','_','_','_','_','_'],
  ['P','P','P','P','_','P','P','P'],
  ['R','_','B','Q','K','B','N','R'],
];

const PIECE_MAP: Record<string, string> = {
  r:'♜',n:'♞',b:'♝',q:'♛',k:'♚',p:'♟',
  R:'♖',N:'♘',B:'♗',Q:'♕',K:'♔',P:'♙',
};

function MiniBoardPreview() {
  return (
    <div className="select-none rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(34,197,94,0.15),0_32px_64px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
      {BOARD_PREVIEW.map((row, ri) => (
        <div key={ri} className="flex">
          {row.map((cell, ci) => {
            const isLight = (ri + ci) % 2 === 0;
            const piece = PIECE_MAP[cell] ?? '';
            const isWhite = cell === cell.toUpperCase() && cell !== '_';
            return (
              <div
                key={ci}
                className="relative flex items-center justify-center"
                style={{
                  width: 48, height: 48,
                  background: isLight ? '#f0d9b5' : '#b58863',
                }}
              >
                {piece && (
                  <span
                    className="text-[26px] leading-none"
                    style={{
                      color: isWhite ? '#fff' : '#1a1a1a',
                      textShadow: isWhite
                        ? '0 1px 3px rgba(0,0,0,0.8), 0 0 8px rgba(34,197,94,0.3)'
                        : '0 1px 2px rgba(0,0,0,0.5)',
                      filter: isWhite ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' : 'drop-shadow(0 1px 1px rgba(0,0,0,0.4))',
                    }}
                  >
                    {piece}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { initGuestProfile } = useUserStore();
  useEffect(() => { initGuestProfile(); }, [initGuestProfile]);

  return (
    <div className="relative overflow-x-hidden bg-[#080b14]">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden hero-bg">
        {/* Grid pattern */}
        <div className="absolute inset-0 chess-pattern opacity-40 pointer-events-none" />

        {/* Top gradient orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-500/[0.07] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-0 w-[500px] h-[400px] bg-violet-500/[0.05] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div>
            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI-Powered Chess Learning
            </motion.div>

            <motion.h1 {...fadeUp(0.08)} className="text-5xl sm:text-6xl lg:text-[4.2rem] font-black leading-[1.08] tracking-tight mb-6">
              Master Chess{' '}
              <span className="text-gradient">from Scratch</span>
              <br />
              to{' '}
              <span className="text-gradient-gold">Grandmaster</span>
            </motion.h1>

            <motion.p {...fadeUp(0.16)} className="text-[17px] text-gray-400 leading-relaxed mb-8 max-w-lg">
              Interactive lessons, tactical puzzles, Stockfish AI, and real‑time coaching —
              all in one beautifully designed platform.
            </motion.p>

            <motion.div {...fadeUp(0.24)} className="flex flex-wrap gap-3 mb-12">
              <Link href="/tutorial">
                <Button variant="primary" size="xl" leftIcon={<BookOpen size={18} />} rightIcon={<ArrowRight size={16} />}>
                  Start Learning Free
                </Button>
              </Link>
              <Link href="/play/computer">
                <Button variant="secondary" size="xl" leftIcon={<Swords size={18} />}>
                  Play vs AI
                </Button>
              </Link>
              <Link href="/play/player">
                <Button variant="ghost" size="xl" leftIcon={<Users size={18} />}>
                  Challenge a Friend
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div {...fadeUp(0.32)} className="flex items-center gap-8 flex-wrap">
              {[
                { value: '50K+', label: 'Learners' },
                { value: '18',   label: 'Lessons' },
                { value: '1K+',  label: 'Puzzles' },
                { value: '4.9★', label: 'Rating' },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-2xl font-black text-white tabular-nums">{s.value}</p>
                  <p className="text-gray-500 text-xs font-medium">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — board preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 1.02, 0.73, 1] }}
            className="hidden lg:flex flex-col items-center gap-6"
          >
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="self-end bg-[#0e1422] border border-emerald-500/30 rounded-2xl px-4 py-3 shadow-[0_0_20px_rgba(34,197,94,0.15)] flex items-center gap-2.5 text-sm"
            >
              <span className="text-xl">♘</span>
              <div>
                <p className="text-white font-semibold text-xs">Nf6 — Best move!</p>
                <p className="text-emerald-400 text-[11px]">+0.8 advantage</p>
              </div>
            </motion.div>

            <MiniBoardPreview />

            {/* Floating badge bottom */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="self-start bg-[#0e1422] border border-violet-500/30 rounded-2xl px-4 py-3 shadow-[0_0_20px_rgba(139,92,246,0.15)] flex items-center gap-2.5 text-sm"
            >
              <span className="text-xl">🧩</span>
              <div>
                <p className="text-white font-semibold text-xs">Puzzle Solved!</p>
                <p className="text-violet-400 text-[11px]">+40 XP earned</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl font-black text-white mb-4">
              Everything you need to{' '}
              <span className="text-gradient">improve fast</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              From your first pawn move to complex endgame theory.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4, transition: { duration: 0.15 } }}
                className="group bg-[#0e1422] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-6 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 transition-all duration-200 ${accentConfig[f.accent]}`}>
                  {f.icon}
                </div>
                <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-4xl font-black text-white">Three steps to better chess</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01', icon: <BookOpen size={28} />,
                title: 'Learn', accent: 'emerald',
                desc: 'Work through structured lessons. Our AI coach guides every move with real explanations.',
                cta: 'Start a Lesson', href: '/tutorial',
              },
              {
                step: '02', icon: <Swords size={28} />,
                title: 'Practice', accent: 'violet',
                desc: 'Apply new skills against Stockfish. Adjust difficulty and get a full game report.',
                cta: 'Play vs Computer', href: '/play/computer',
              },
              {
                step: '03', icon: <Users size={28} />,
                title: 'Compete', accent: 'amber',
                desc: 'Challenge friends locally or online with a 4-letter room code.',
                cta: 'Play a Friend', href: '/play/player',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -4, transition: { duration: 0.15 } }}
                className="relative bg-[#0e1422] border border-white/[0.06] hover:border-white/[0.1] rounded-2xl p-8 text-center transition-all duration-200"
              >
                <div className="text-[64px] font-black text-white/[0.03] absolute top-4 left-6 select-none leading-none">{item.step}</div>
                <div className={`w-14 h-14 rounded-2xl border mx-auto mb-5 flex items-center justify-center ${accentConfig[item.accent]}`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{item.desc}</p>
                <Link href={item.href}>
                  <Button
                    variant={item.accent === 'emerald' ? 'primary' : item.accent === 'amber' ? 'gold' : 'outline'}
                    size="md"
                    className="w-full"
                    rightIcon={<ChevronRight size={15} />}
                  >
                    {item.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-4xl font-black text-white">Loved by players worldwide</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0e1422] border border-white/[0.06] rounded-2xl p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#161d2f] border border-white/[0.08] flex items-center justify-center text-lg">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-tight">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/60 via-[#0e1422] to-violet-950/40 p-12 text-center"
          >
            {/* Orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[200px] bg-violet-500/08 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <div className="text-5xl mb-5">♛</div>
              <h2 className="text-4xl font-black text-white mb-3">Ready to level up?</h2>
              <p className="text-gray-400 mb-8 text-lg">
                Join thousands of players improving every day. Always free to start.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/tutorial">
                  <Button variant="primary" size="xl" leftIcon={<BookOpen size={18} />}>
                    Start Learning Free
                  </Button>
                </Link>
                <Link href="/play/computer">
                  <Button variant="secondary" size="xl" leftIcon={<Swords size={18} />}>
                    Play Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
