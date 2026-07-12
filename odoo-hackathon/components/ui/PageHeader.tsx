'use client';

import { motion } from 'framer-motion';
import { itemVariants } from './motionVariants';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  statusDot?: boolean;
  children?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, statusDot = false, children }: PageHeaderProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10"
    >
      <div>
        {statusDot && (
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
            </div>
            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.2em] font-semibold">
              Systems Operational
            </span>
          </div>
        )}
        {/* Light: flat bold slate, Dark: gradient white-to-emerald */}
        <h1 className="text-3xl md:text-4xl font-serif font-medium tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-cyan-100 dark:to-emerald-200">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-500 dark:text-cyan-100/50 mt-2 text-sm leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {children && <div className="flex gap-3">{children}</div>}
    </motion.div>
  );
}
