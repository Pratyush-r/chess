'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color?: 'green' | 'blue' | 'purple' | 'gold';
  index?: number;
}

const colors = {
  green: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  gold: 'text-gold-400 bg-gold-500/10 border-gold-500/20',
};

export default function StatsCard({ title, value, subtitle, icon, trend, color = 'green', index = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend.value >= 0 ? 'text-primary-400 bg-primary-500/10' : 'text-red-400 bg-red-500/10'
          }`}>
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
        <p className="text-gray-400 text-sm mt-0.5">{title}</p>
        {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );
}
