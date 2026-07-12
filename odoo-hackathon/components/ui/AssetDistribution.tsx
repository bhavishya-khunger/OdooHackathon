"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { itemVariants } from './motionVariants';
import { PieChart as PieChartIcon } from 'lucide-react';

export const AssetDistribution = ({ assets }: { assets: any[] }) => {
  const data = useMemo(() => {
    const categoryCount: Record<string, number> = {};
    assets.forEach(asset => {
      const cat = asset.category_name || 'Uncategorized';
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    return Object.entries(categoryCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // sort descending
  }, [assets]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b'];

  return (
    <motion.div variants={itemVariants} className="w-full h-full bg-surface border border-border rounded-3xl p-6 transition-colors duration-300 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[15px] font-semibold text-foreground flex items-center gap-2">
          <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          Fleet Distribution
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">Asset breakdown by category</p>

      {assets.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted opacity-50">
          <PieChartIcon className="h-8 w-8 mb-2" />
          <p className="text-sm">No assets found</p>
        </div>
      ) : (
        <div className="flex-1 min-h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px', fontSize: '13px' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};
