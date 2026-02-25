'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AuthFlow from '@/components/auth-flow';
import Sidebar from '@/components/sidebar';
import Navbar from '@/components/navbar';
import ProfilePanel from '@/components/profile-panel';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Extract active tab from pathname
  const activeTab = pathname.split('/')[1] || 'dashboard';

  if (!isAuthenticated) {
    return <AuthFlow onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex w-full relative">
        {/* Sidebar - Fixed/Sticky */}
        <div className={cn(
          "h-screen sticky top-0 bg-[#4a907a] z-40 transition-all duration-300",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}>
          <Sidebar 
            activeTab={activeTab} 
            isCollapsed={isSidebarCollapsed} 
            setIsCollapsed={setIsSidebarCollapsed} 
            onLogout={() => setIsAuthenticated(false)}
          />
        </div>
        
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          {/* Navbar - Sticky */}
          <div className="sticky top-0 z-30 bg-white border-b border-zinc-100">
            <Navbar onProfileClick={() => setIsProfileOpen(true)} />
          </div>
          
          <main className="flex-1 p-10 overflow-y-auto bg-white no-scrollbar">
            {children}
          </main>
        </div>
      </div>

      <ProfilePanel isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}
