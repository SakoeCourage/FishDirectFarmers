'use client';

import React from 'react';
import { Bell, Settings, Edit3, Wallet, TrendingUp, X } from 'lucide-react';
import { Button } from '@/components/form-elements';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfilePanel({ isOpen, onClose }: ProfilePanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-[#151619] text-white flex flex-col p-6 z-[70] shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Profile</h2>
              <div className="flex gap-2">
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
            </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative w-24 h-24 mb-4">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#86efac] to-emerald-400 rounded-3xl rotate-6 opacity-20" />
          <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-[#86efac]/20">
            <Image
              src="https://picsum.photos/seed/farmer/200"
              alt="Farmer Profile"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <h3 className="text-lg font-bold">Kofi Mensah</h3>
        <p className="text-zinc-500 text-xs">Volta Lake Farm • Premium Seller</p>
        
        <div className="flex gap-1 mt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`h-1 w-6 rounded-full ${i <= 3 ? 'bg-[#86efac]' : 'bg-zinc-700'}`} />
          ))}
        </div>
        <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-widest font-bold">3 from 5 tasks completed</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="text-center">
          <p className="text-lg font-bold">12</p>
          <p className="text-[10px] text-zinc-500 uppercase font-bold">Harvests</p>
        </div>
        <div className="text-center border-x border-zinc-800">
          <p className="text-lg font-bold">1.2K</p>
          <p className="text-[10px] text-zinc-500 uppercase font-bold">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">850</p>
          <p className="text-[10px] text-zinc-500 uppercase font-bold">Sales</p>
        </div>
      </div>

      <Button variant="primary" className="w-full mb-10 rounded-2xl">
        <Edit3 className="w-4 h-4 mr-2" />
        Edit Profile
      </Button>

      <div className="mt-auto">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold">Earning</h4>
          <button className="p-1 rounded-full bg-zinc-800 text-zinc-400 hover:text-white">
            <Settings className="w-3 h-3" />
          </button>
        </div>
        
        <div className="bg-zinc-900/50 rounded-3xl p-6 border border-zinc-800">
          <div className="w-10 h-10 bg-[#86efac]/10 rounded-xl flex items-center justify-center mb-4">
            <Wallet className="w-5 h-5 text-[#86efac]" />
          </div>
          <p className="text-3xl font-bold mb-1">GH₵ 12,450</p>
          <p className="text-xs text-zinc-500 mb-6">Your earning this month</p>
          
          <div className="flex items-center gap-2 text-[#86efac] text-xs mb-6 bg-[#86efac]/5 p-2 rounded-lg">
            <TrendingUp className="w-3 h-3" />
            <span>+12.5% from last month</span>
          </div>

          <Button className="w-full bg-[#4a907a] text-white hover:bg-[#3d7a66] rounded-2xl h-12 font-bold">
            Withdraw Earning
          </Button>
        </div>
      </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
