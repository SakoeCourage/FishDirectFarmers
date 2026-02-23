'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  LineChart, 
  FileText, 
  Store, 
  MapPin, 
  MessageSquare, 
  LogOut,
  Fish
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Package, label: 'Harvests', id: 'harvests' },
  { icon: Users, label: 'Customers', id: 'customers' },
  { icon: LineChart, label: 'Analytics', id: 'analytics' },
  { icon: FileText, label: 'Reports', id: 'reports' },
];

const businessItems = [
  { icon: Store, label: 'My Store', id: 'store' },
  { icon: MapPin, label: 'Farm Location', id: 'location' },
  { icon: MessageSquare, label: 'Chat', id: 'chat', badge: true },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-64 bg-[#4a907a] flex flex-col p-6">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <Fish className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight text-white">Foodaily</span>
      </div>

      <div className="flex-1 space-y-8">
        <div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all relative group",
                  activeTab === item.id 
                    ? "text-white bg-white/10" 
                    : "text-white/70 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-white" : "text-white/50 group-hover:text-white/80")} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div>
          <nav className="space-y-1">
            {businessItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group",
                  activeTab === item.id 
                    ? "text-white bg-white/10" 
                    : "text-white/70 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-white" : "text-white/50 group-hover:text-white/80")} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && <div className="w-1.5 h-1.5 rounded-full bg-red-400" />}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <button className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all mt-auto">
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
}
