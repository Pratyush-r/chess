'use client';

import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color?: 'green' | 'blue' | 'purple' | 'gold';
  index?: number;
}

const accentMap = {
  green:  { icon: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', trend: 'text-emerald-400 bg-emerald-500/10' },
  blue:   { icon: 'bg-blue-500/10 text-blue-400 border-blue-500/20',          trend: 'text-blue-400 bg-blue-500/10' },
  purple: { icon: 'bg-violet-500/10 text-violet-400 border-violet-500/20',    trend: 'text-violet-400 bg-violet-500/10' },
  gold:   { icon: 'bg-amber-500/10 text-amber-400 border-amber-500/20',       trend: 'text-amber-400 bg-amber-500/10' },
};

export default function StatsCard({ title, value, subtitle, icon, trend, color = 'green', index = 0 }: StatsCardProps) {
  const acc = accentMap[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, ease: [0.21, 1.02, 0.73, 1] }}
      className="bg-[#0e1422] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden"
    >
      {/* Top accent line */}
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
        color === 'green' ? 'via-emerald-500/40' :
        color === 'blue' ? 'via-blue-500/40' :
        color === 'purple' ? 'via-violet-500/40' :
        'via-amber-500/40'
      } to-transparent`} />

      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center text-sm ${acc.icon}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${acc.trend}`}>
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-white tabular-nums">{value}</p>
      <p className="text-gray-500 text-xs font-medium mt-0.5">{title}</p>
      {subtitle && <p className="text-gray-600 text-[11px] mt-1">{subtitle}</p>}
    </motion.div>
  );
}
