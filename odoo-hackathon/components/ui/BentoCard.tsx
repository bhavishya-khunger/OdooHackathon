'use client';

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { itemVariants, smoothTransition } from './motionVariants';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function BentoCard({ children, className = '', hover = false }: BentoCardProps) {
  return (
    <motion.div
      variants={itemVariants as Variants}
      whileHover={hover ? { y: -4, rotate: 0.5, transition: smoothTransition } : undefined}
      className={`
        bg-white/80 dark:bg-[#051324]/60
        backdrop-blur-2xl
        border border-slate-200 dark:border-cyan-900/30
        rounded-3xl
        shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        overflow-hidden relative group
        transition-colors duration-300
        ${className}
      `}
    >
      {/* Inner top highlight — more subtle in light, cyan in dark */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200/80 dark:via-cyan-400/20 to-transparent pointer-events-none" />
      {hover && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-cyan-500/5 via-transparent to-emerald-500/5 transition-opacity duration-500 pointer-events-none" />
      )}
      {children}
    </motion.div>
  );
}
