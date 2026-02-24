'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthFlow from '@/components/auth-flow';
import Sidebar from '@/components/sidebar';
import Navbar from '@/components/navbar';
import ProfilePanel from '@/components/profile-panel';
import DashboardHome from '@/components/dashboard-home';
import HarvestManagement from '@/components/harvest-management';
import CustomerManagement from '@/components/customer-management';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome />;
      case 'harvests':
        return <HarvestManagement />;
      case 'customers':
        return <CustomerManagement />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[80vh] text-zinc-400">
            <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
            <p>The {activeTab} module is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F7F6]">
      <div className="flex w-full max-w-[1600px] mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden border border-zinc-100 relative">
        {/* Sidebar - Fixed/Sticky */}
        <div className={cn(
          "h-screen sticky top-0 bg-[#4a907a] z-40 transition-all duration-300",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}>
          <Sidebar 
            activeTab={activeTab} 
            isCollapsed={isSidebarCollapsed} 
            setIsCollapsed={setIsSidebarCollapsed} 
          />
        </div>
        
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          {/* Navbar - Sticky */}
          <div className="sticky top-0 z-30 bg-white border-b border-zinc-100">
            <Navbar onProfileClick={() => setIsProfileOpen(true)} />
          </div>
          
          <main className="flex-1 p-10 overflow-y-auto bg-white no-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <ProfilePanel isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AuthFlow onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
