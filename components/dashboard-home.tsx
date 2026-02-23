'use client';

import React from 'react';
import { Card } from '@/components/form-elements';
import { TrendingUp, Users, Package, Activity, Search, ChevronRight, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { FishDirectDataTable } from '@/components/data-table';
import { InputText } from 'primereact/inputtext';

const stats = [
  { label: 'Orders', value: '$35,485', trend: '+2.8%', icon: Package, color: 'bg-[#4a907a]', textColor: 'text-white', trendColor: 'text-white/80' },
  { label: 'Avg. Order Amount', value: '$8,562', trend: '+2.8%', icon: Activity, color: 'bg-white', textColor: 'text-zinc-900', trendColor: 'text-zinc-400' },
  { label: 'Unique Customers', value: '15,235', trend: '+2.8%', icon: Users, color: 'bg-white', textColor: 'text-zinc-900', trendColor: 'text-zinc-400' },
  { label: 'Net Sales', value: '$9,584', trend: '+3.8%', icon: TrendingUp, color: 'bg-white', textColor: 'text-zinc-900', trendColor: 'text-zinc-400' },
];

const transactions = [
  { id: '#FD-202401', date: 'Feb 22, 2024', amount: 'GH₵ 450.00', status: 'Pending', type: 'Catfish' },
  { id: '#FD-202402', date: 'Feb 21, 2024', amount: 'GH₵ 1,200.00', status: 'Completed', type: 'Tilapia' },
  { id: '#FD-202403', date: 'Feb 20, 2024', amount: 'GH₵ 850.00', status: 'In Transit', type: 'Catfish' },
  { id: '#FD-202404', date: 'Feb 19, 2024', amount: 'GH₵ 320.00', status: 'Completed', type: 'Tilapia' },
];

export default function DashboardHome() {
  const columns = [
    {
      field: 'id',
      header: 'Transaction ID',
      body: (tx: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#86efac]/10 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-[#22c55e]" />
          </div>
          <span className="font-bold">{tx.id}</span>
        </div>
      )
    },
    { field: 'date', header: 'Date' },
    { field: 'type', header: 'Species' },
    { field: 'amount', header: 'Amount', body: (tx: any) => <span className="font-bold">{tx.amount}</span> },
    {
      field: 'status',
      header: 'Status',
      body: (tx: any) => (
        <span className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
          tx.status === 'Completed' ? "bg-emerald-100 text-emerald-700" : 
          tx.status === 'Pending' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
        )}>
          {tx.status}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Overview</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-50 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100 transition-colors">
          Today
          <ChevronDown className="w-3 h-3" />
        </button>
      </header>

      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={cn("border-none relative overflow-hidden group h-32 flex flex-col justify-between p-5 shadow-sm", stat.color)}>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn("p-1.5 rounded-lg", stat.color === 'bg-white' ? "bg-zinc-100" : "bg-white/20")}>
                    <stat.icon className={cn("w-4 h-4", stat.color === 'bg-white' ? "text-zinc-500" : "text-white")} />
                  </div>
                  <p className={cn("text-xs font-medium", stat.color === 'bg-white' ? "text-zinc-500" : "text-white/80")}>{stat.label}</p>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className={cn("text-2xl font-bold", stat.textColor)}>{stat.value}</h3>
                    <p className={cn("text-[10px] mt-1", stat.trendColor)}>Compared to last year</p>
                  </div>
                  <div className={cn("flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md", stat.color === 'bg-white' ? "text-emerald-500 bg-emerald-50" : "text-white bg-white/20")}>
                    {stat.trend}
                    <TrendingUp className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Revenue</h3>
            <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#4a907a]" />
                <span className="text-zinc-900">This week</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-zinc-200" />
                <span className="text-zinc-400">Last week</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end gap-4 px-2">
            {[40, 65, 45, 90, 55, 75, 50].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                <div className="w-full relative">
                   <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="w-full bg-zinc-50 rounded-t-xl group-hover:bg-[#4a907a]/20 transition-colors"
                  />
                  {i === 3 && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#4a907a] text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">
                      $2.8K
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold mb-8">Customers</h3>
          <div className="relative flex items-center justify-center py-10">
            <svg className="w-48 h-48 -rotate-90">
              <circle cx="96" cy="96" r="80" fill="none" stroke="#f4f4f5" strokeWidth="16" />
              <circle 
                cx="96" cy="96" r="80" 
                fill="none" stroke="#4a907a" 
                strokeWidth="16" 
                strokeDasharray="502" 
                strokeDashoffset="316" 
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">37%</span>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#4a907a]" />
                <span className="text-zinc-500">Current Customers</span>
              </div>
              <span>124</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-zinc-900" />
                <span className="text-zinc-500">New Customers</span>
              </div>
              <span>32</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between p-6">
          <h3 className="text-lg font-bold">Recent Transactions</h3>
          <button className="text-xs font-bold text-[#22c55e] hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <FishDirectDataTable 
          data={transactions} 
          columns={columns} 
          enablePaginator={false} 
          enableTableFilter={false}
        />
      </Card>
    </div>
  );
}
