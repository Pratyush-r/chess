'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen, Swords, Users, Trophy, Zap, Star,
  ChevronRight, Shield, Brain, TrendingUp, Puzzle,
  Award, Target, Clock
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useUserStore } from '@/store/userStore';

const FLOATING_PIECES = [
  { piece: '♛', size: 'text-6xl', top: '15%', left: '8%', class: 'float-1', color: 'text-gold-400/20' },
  { piece: '♞', size: 'text-5xl', top: '25%', right: '10%', class: 'float-2', color: 'text-primary-400/20' },
  { piece: '♜', size: 'text-7xl', bottom: '20%', left: '12%', class: 'float-3', color: 'text-purple-400/20' },
  { piece: '♝', size: 'text-5xl', bottom: '30%', right: '8%', class: 'float-1', color: 'text-blue-400/20' },
  { piece: '♚', size: 'text-6xl', top: '50%', left: '3%', class: 'float-2', color: 'text-red-400/15' },
  { piece: '♟', size: 'text-4xl', top: '10%', right: '20%', class: 'float-3', color: 'text-gray-400/20' },
];

const FEATURES = [
  {
    icon: <BookOpen size={24} />,
    title: 'Interactive Lessons',
    description: 'Step-by-step guided lessons from beginner to grandmaster level with real-time feedback.',
    color: 'green',
  },
  {
    icon: <Brain size={24} />,
    title: 'AI-Powered Coach',
    description: 'Our intelligent coach analyzes your moves and explains mistakes in simple language.',
    color: 'purple',
  },
  {
    icon: <Swords size={24} />,
    title: 'Play vs AI',
    description: 'Challenge Stockfish at 5 difficulty levels from beginner to expert with full analysis.',
    color: 'blue',
  },
  {
    icon: <Users size={24} />,
    title: 'Multiplayer',
    description: 'Play against friends locally or online with room codes and live game sync.',
    color: 'gold',
  },
  {
    icon: <Puzzle size={24} />,
    title: 'Daily Puzzles',
    description: '1000+ tactical puzzles to sharpen your pattern recognition and calculation.',
    color: 'green',
  },
  {
    icon: <TrendingUp size={24} />,
    title: 'Track Progress',
    description: 'XP system, ratings, achievements and detailed stats to motivate your improvement.',
    color: 'purple',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah K.',
    title: 'Club Player',
    rating: '1450',
    text: 'ChessMaster Academy helped me go from 900 to 1450 in just 3 months. The lessons are incredibly clear!',
    avatar: '👩',
  },
  {
    name: 'Marcus T.',
    title: 'Tournament Player',
    rating: '1820',
    text: 'The tactical puzzles and AI analysis are world-class. This is the best chess learning platform I\'ve used.',
    avatar: '👨',
  },
  {
    name: 'Emma L.',
    title: 'Complete Beginner',
    rating: '850',
    text: 'I had zero chess knowledge. After 2 weeks of lessons, I\'m beating my friends consistently!',
    avatar: '👧',
  },
];

const STATS = [
  { value: '50K+', label: 'Active Learners' },
  { value: '200+', label: 'Interactive Lessons' },
  { value: '1,000+', label: 'Tactical Puzzles' },
  { value: '4.9★', label: 'Average Rating' },
];

const colorClasses: Record<string, string> = {
  green: 'text-primary-400 bg-primary-500/10 border-primary-500/20 group-hover:bg-primary-500/20',
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500/20',
  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500/20',
  gold: 'text-gold-400 bg-gold-500/10 border-gold-500/20 group-hover:bg-gold-500/20',
};

export default function HomePage() {
  const { initGuestProfile } = useUserStore();

  useEffect(() => {
    initGuestProfile();
  }, [initGuestProfile]);

  return (
    <div className="relative overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden animated-gradient">
        {/* Chess pattern overlay */}
        <div className="absolute inset-0 chess-pattern opacity-30" />

        {/* Floating pieces */}
        {FLOATING_PIECES.map((p, i) => (
          <div
            key={i}
            className={`absolute select-none pointer-events-none ${p.piece === '♛' || p.piece === '♜' || p.piece === '♚' ? 'hidden md:block' : 'hidden lg:block'} ${p.class} ${p.size} ${p.color}`}
            style={{
              top: (p as any).top,
              bottom: (p as any).bottom,
              left: (p as any).left,
              right: (p as any).right,
            }}
          >
            {p.piece}
          </div>
        ))}

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-6 text-primary-300 text-sm font-medium">
              <Zap size={14} />
              <span>AI-Powered Chess Learning Platform</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Master Chess{' '}
            <span className="text-gradient">from Zero</span>
            <br />
            to{' '}
            <span className="text-gradient-gold">Grandmaster</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            Interactive lessons, tactical puzzles, AI opponents, and real-time coaching —
            all in one beautifully crafted platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/tutorial">
              <Button variant="primary" size="xl" leftIcon={<BookOpen size={20} />} rightIcon={<ChevronRight size={20} />}>
                Start Learning Free
              </Button>
            </Link>
            <Link href="/play/computer">
              <Button variant="secondary" size="xl" leftIcon={<Swords size={20} />}>
                Play vs Computer
              </Button>
            </Link>
            <Link href="/play/player">
              <Button variant="ghost" size="xl" leftIcon={<Users size={20} />}>
                Play a Friend
              </Button>
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8"
          >
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need to{' '}
              <span className="text-gradient">improve at chess</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From your first pawn move to complex endgame theory — we have the tools to accelerate your growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <Card hover glass className="p-6 h-full">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 transition-all ${colorClasses[feature.color]}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Start improving in minutes</h2>
            <p className="text-gray-400 text-lg">Three simple ways to play and learn</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <BookOpen size={32} />,
                title: 'Learn',
                description: 'Work through structured lessons with interactive exercises. Our AI coach guides you every step.',
                cta: 'Start a Lesson',
                href: '/tutorial',
                color: 'primary',
              },
              {
                step: '02',
                icon: <Swords size={32} />,
                title: 'Practice',
                description: 'Apply what you\'ve learned against Stockfish AI. Choose your difficulty and get real-time analysis.',
                cta: 'Play vs Computer',
                href: '/play/computer',
                color: 'purple',
              },
              {
                step: '03',
                icon: <Users size={32} />,
                title: 'Compete',
                description: 'Challenge friends to local or online games. Create a room and share the code.',
                cta: 'Play a Friend',
                href: '/play/player',
                color: 'gold',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <Card hover glass className="p-8 text-center h-full">
                  <div className="text-5xl font-bold text-gray-800 mb-4">{item.step}</div>
                  <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                    item.color === 'primary' ? 'bg-primary-500/20 text-primary-400' :
                      item.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-gold-500/20 text-gold-400'
                  }`}>
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{item.description}</p>
                  <Link href={item.href}>
                    <Button
                      variant={item.color === 'primary' ? 'primary' : item.color === 'gold' ? 'gold' : 'outline'}
                      size="md"
                      className="w-full"
                      rightIcon={<ChevronRight size={16} />}
                    >
                      {item.cta}
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Loved by chess players worldwide
            </h2>
            <p className="text-gray-400 text-lg">Real results from real players</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card glass className="p-6 h-full">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} className="text-gold-400 fill-gold-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{t.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{t.title}</span>
                        <span>•</span>
                        <span className="text-primary-400">{t.rating} rating</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-900/50 to-purple-900/30 border border-primary-500/20 rounded-3xl p-12"
          >
            <div className="text-5xl mb-6">♛</div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to elevate your game?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of players improving their chess every day. It's free to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tutorial">
                <Button variant="primary" size="xl" leftIcon={<BookOpen size={20} />}>
                  Start Learning Free
                </Button>
              </Link>
              <Link href="/play/computer">
                <Button variant="secondary" size="xl" leftIcon={<Swords size={20} />}>
                  Play Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
