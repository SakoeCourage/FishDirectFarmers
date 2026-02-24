'use client';

import React from 'react';
import { User, Bell, Search, Mic } from 'lucide-react';
import { InputText } from 'primereact/inputtext';
import Image from 'next/image';

interface NavbarProps {
  onProfileClick: () => void;
}

export default function Navbar({ onProfileClick }: NavbarProps) {
  return (
    <nav className="h-20 bg-white px-10 flex items-center justify-between sticky top-0 z-50">
      <div className="flex-1 max-w-2xl relative group flex items-center">
        <Search className="absolute left-4 w-4 h-4 text-zinc-400 z-10" />
        <InputText 
          placeholder="Search..." 
          className="pl-12 pr-12 w-full rounded-xl bg-zinc-50 border-none focus:ring-0 focus:bg-zinc-100 transition-all h-12 text-sm"
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-zinc-200 transition-colors">
          <Mic className="w-4 h-4 text-zinc-400" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onProfileClick}
          className="flex items-center gap-3 p-1 rounded-full hover:bg-zinc-50 transition-all group"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-200">
            <Image
              src="https://picsum.photos/seed/farmer/100"
              alt="User"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-left hidden lg:block pr-2">
            <p className="text-xs font-bold text-zinc-900">Kofi Mensah</p>
            <p className="text-[10px] text-zinc-400 font-medium">Premium Farmer</p>
          </div>
        </button>

        <button className="p-2.5 rounded-full hover:bg-zinc-50 transition-colors relative border border-zinc-100">
          <Bell className="w-5 h-5 text-zinc-500" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
      </div>
    </nav>
  );
}
