'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants = {
  primary: [
    'relative overflow-hidden',
    'bg-gradient-to-b from-emerald-400 to-emerald-600',
    'text-white font-semibold',
    'shadow-[0_0_0_1px_rgba(52,211,153,0.3),0_4px_24px_rgba(34,197,94,0.25)]',
    'hover:shadow-[0_0_0_1px_rgba(52,211,153,0.5),0_8px_32px_rgba(34,197,94,0.4)]',
    'hover:from-emerald-300 hover:to-emerald-500',
    'active:from-emerald-500 active:to-emerald-700',
    'transition-all duration-150',
  ].join(' '),

  secondary: [
    'bg-white/[0.06] hover:bg-white/[0.1]',
    'text-white/90 hover:text-white',
    'border border-white/10 hover:border-white/20',
    'backdrop-blur-sm',
    'shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
    'transition-all duration-150',
  ].join(' '),

  ghost: [
    'text-gray-400 hover:text-white',
    'hover:bg-white/[0.06]',
    'transition-all duration-150',
  ].join(' '),

  danger: [
    'bg-red-500/10 hover:bg-red-500/20',
    'text-red-400 hover:text-red-300',
    'border border-red-500/20 hover:border-red-500/40',
    'transition-all duration-150',
  ].join(' '),

  gold: [
    'relative overflow-hidden',
    'bg-gradient-to-b from-amber-300 to-amber-500',
    'text-amber-950 font-bold',
    'shadow-[0_0_0_1px_rgba(251,191,36,0.4),0_4px_20px_rgba(251,191,36,0.2)]',
    'hover:shadow-[0_0_0_1px_rgba(251,191,36,0.6),0_8px_28px_rgba(251,191,36,0.35)]',
    'hover:from-amber-200 hover:to-amber-400',
    'transition-all duration-150',
  ].join(' '),

  outline: [
    'border border-emerald-500/40 hover:border-emerald-400/70',
    'text-emerald-400 hover:text-emerald-300',
    'hover:bg-emerald-500/[0.08]',
    'transition-all duration-150',
  ].join(' '),
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-6 py-2.5 text-sm rounded-xl gap-2',
  xl: 'px-7 py-3.5 text-base rounded-2xl gap-2.5',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}, ref) => {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.015 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.975 }}
      className={cn(
        'inline-flex items-center justify-center font-medium',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080b14]',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        'select-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (leftIcon && <span className="shrink-0">{leftIcon}</span>)}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </motion.button>
  );
});

Button.displayName = 'Button';
export default Button;
