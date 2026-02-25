'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Fish,
  ChevronLeft,
  ChevronRight,
  ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { Tooltip } from 'primereact/tooltip';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: ShoppingCart, label: 'Orders', id: 'orders' },
  { icon: Package, label: 'Harvests', id: 'harvests' },
  { icon: Users, label: 'Customers', id: 'customers' },
  { icon: LineChart, label: 'Analytics', id: 'analytics' },
  { icon: FileText, label: 'Reports', id: 'reports' },
];

const businessItems = [
  { icon: Store, label: 'Marketplace', id: 'marketplace' },
  { icon: Store, label: 'My Store', id: 'store' },
  { icon: MapPin, label: 'Farm Location', id: 'location' },
  { icon: MessageSquare, label: 'Chat', id: 'chat', badge: true },
];

interface SidebarProps {
  activeTab: string;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, isCollapsed, setIsCollapsed, onLogout }: SidebarProps) {
  return (
    <div className={cn(
      "h-full bg-[#4a907a] flex flex-col transition-all duration-300 relative",
      isCollapsed ? "w-20 p-4" : "w-64 p-6"
    )}>
      <Tooltip target=".sidebar-item" position="right" />
      
      <div className={cn("flex items-center gap-3 mb-10 px-2", isCollapsed && "justify-center px-0")}>
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0">
          <Fish className="w-6 h-6 text-white" />
        </div>
        {!isCollapsed && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-bold text-xl tracking-tight text-white whitespace-nowrap"
          >
            Foodaily
          </motion.span>
        )}
      </div>

      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border border-zinc-100 text-[#4a907a] hover:bg-zinc-50 transition-colors z-50"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
        <div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={`/${item.id}`}
                data-pr-tooltip={isCollapsed ? item.label : ""}
                className={cn(
                  "sidebar-item w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all relative group",
                  activeTab === item.id 
                    ? "text-white bg-white/10" 
                    : "text-white/70 hover:text-white hover:bg-white/5",
                  isCollapsed && "justify-center"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", activeTab === item.id ? "text-white" : "text-white/50 group-hover:text-white/80")} />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <nav className="space-y-1">
            {businessItems.map((item) => (
              <Link
                key={item.id}
                href={`/${item.id}`}
                data-pr-tooltip={isCollapsed ? item.label : ""}
                className={cn(
                  "sidebar-item w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group relative",
                  activeTab === item.id 
                    ? "text-white bg-white/10" 
                    : "text-white/70 hover:text-white hover:bg-white/5",
                  isCollapsed && "justify-center"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", activeTab === item.id ? "text-white" : "text-white/50 group-hover:text-white/80")} />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 text-left whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
                {item.badge && (
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full bg-red-400",
                    isCollapsed ? "absolute top-2 right-2" : "ml-2"
                  )} />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <button 
        onClick={onLogout}
        className={cn(
          "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all mt-auto",
          isCollapsed && "justify-center"
        )}
      >
        <LogOut className="w-5 h-5 shrink-0" />
        {!isCollapsed && <span>Logout</span>}
      </button>
    </div>
  );
}
