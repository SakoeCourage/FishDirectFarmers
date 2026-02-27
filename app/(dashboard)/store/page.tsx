'use client';

import React, { useState } from 'react';
import { Store, Eye, Settings, Share2, TrendingUp, Users, ShoppingBag, Star, ExternalLink, Globe, Palette, Layout } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Card, Button } from '@/components/form-elements';
import Image from 'next/image';

const STORE_STATS = [
  { label: 'Store Views', value: '1,284', trend: '+12%', icon: Eye },
  { label: 'Total Orders', value: '156', trend: '+5%', icon: ShoppingBag },
  { label: 'Store Rating', value: '4.9', trend: '0.0', icon: Star },
  { label: 'Conversion Rate', value: '3.2%', trend: '+0.8%', icon: TrendingUp },
];

const FEATURED_PRODUCTS = [
  { id: 1, name: 'Fresh Smoked Catfish', price: 'GH₵ 45.00', image: 'https://picsum.photos/seed/catfish/400/300' },
  { id: 2, name: 'Large Fresh Tilapia', price: 'GH₵ 35.00', image: 'https://picsum.photos/seed/tilapia/400/300' },
  { id: 3, name: 'Tilapia Fingerlings', price: 'GH₵ 1.50', image: 'https://picsum.photos/seed/fingerlings/400/300' },
];

export default function MyStorePage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">My Store</h1>
          <p className="text-zinc-500 text-sm">Manage your public storefront and track performance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share Store
          </Button>
          <Button className="bg-[#4a907a] text-white hover:bg-[#3d7a66] rounded-xl flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            View Live Store
          </Button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STORE_STATS.map((stat, i) => (
          <Card key={i} className="p-6 border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-[#4a907a]">
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            </div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-black text-zinc-900 mt-1">{stat.value}</h3>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <div className="flex gap-8 border-b border-zinc-100">
        {['overview', 'appearance', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-4 text-sm font-bold capitalize transition-all relative",
              activeTab === tab ? "text-[#4a907a]" : "text-zinc-400 hover:text-zinc-600"
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#4a907a] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Store Preview */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden border-zinc-100 shadow-xl rounded-[2.5rem]">
            {/* Browser Chrome */}
            <div className="bg-zinc-50 p-4 border-b border-zinc-100 flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
              </div>
              <div className="flex-1 bg-white border border-zinc-200 rounded-lg px-3 py-1 text-[10px] text-zinc-400 flex items-center gap-2">
                <Globe className="w-3 h-3" />
                fishdirect.gh/store/aquafresh-farms
              </div>
            </div>

            {/* Store Content */}
            <div className="bg-white min-h-[600px]">
              {/* Store Header */}
              <div className="h-48 bg-zinc-900 relative">
                <Image 
                  src="https://picsum.photos/seed/farm-banner/1200/400" 
                  alt="Banner" 
                  fill 
                  className="object-cover opacity-60"
                />
                <div className="absolute -bottom-12 left-12 flex items-end gap-6">
                  <div className="w-32 h-32 rounded-[2rem] bg-white p-2 shadow-2xl">
                    <div className="w-full h-full rounded-[1.5rem] bg-[#4a907a] flex items-center justify-center text-white">
                      <Store className="w-12 h-12" />
                    </div>
                  </div>
                  <div className="pb-4">
                    <h2 className="text-2xl font-black text-zinc-900">AquaFresh Farms</h2>
                    <p className="text-sm font-medium text-zinc-500">Premium Aquaculture Products • Ada West</p>
                  </div>
                </div>
              </div>

              {/* Store Body */}
              <div className="pt-20 px-12 pb-12 space-y-12">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-zinc-900">Featured Products</h3>
                  <button className="text-sm font-bold text-[#4a907a]">View All</button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {FEATURED_PRODUCTS.map((product) => (
                    <div key={product.id} className="group cursor-pointer">
                      <div className="aspect-[4/3] rounded-3xl overflow-hidden relative mb-4 border border-zinc-100 shadow-sm transition-all group-hover:shadow-xl group-hover:-translate-y-1">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs font-black text-zinc-900 shadow-sm">
                          {product.price}
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-900 group-hover:text-[#4a907a] transition-colors">{product.name}</h4>
                      <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Available Now</p>
                    </div>
                  ))}
                </div>

                <div className="p-8 bg-zinc-50 rounded-[2rem] border border-zinc-100 text-center space-y-4">
                  <h4 className="text-lg font-bold text-zinc-900">About Our Farm</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed max-w-lg mx-auto">
                    We specialize in sustainable tilapia and catfish farming in the Ada West region. 
                    Our products are harvested daily to ensure the highest quality and freshness for our customers.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Quick Actions & Customization */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <button className="w-full p-4 bg-white border border-zinc-100 rounded-2xl flex items-center gap-4 hover:border-[#4a907a] hover:bg-[#4a907a]/5 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-[#4a907a] group-hover:text-white transition-all">
                  <Palette className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-zinc-900">Edit Appearance</p>
                  <p className="text-[10px] text-zinc-500">Colors, fonts, and layout</p>
                </div>
              </button>
              <button className="w-full p-4 bg-white border border-zinc-100 rounded-2xl flex items-center gap-4 hover:border-[#4a907a] hover:bg-[#4a907a]/5 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-[#4a907a] group-hover:text-white transition-all">
                  <Layout className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-zinc-900">Manage Sections</p>
                  <p className="text-[10px] text-zinc-500">Add or remove store sections</p>
                </div>
              </button>
              <button className="w-full p-4 bg-white border border-zinc-100 rounded-2xl flex items-center gap-4 hover:border-[#4a907a] hover:bg-[#4a907a]/5 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-[#4a907a] group-hover:text-white transition-all">
                  <Settings className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-zinc-900">Store Settings</p>
                  <p className="text-[10px] text-zinc-500">Domain, SEO, and visibility</p>
                </div>
              </button>
            </div>
          </div>

          <Card className="p-6 bg-[#4a907a]/5 border-[#4a907a]/10 rounded-[2rem]">
            <h4 className="text-sm font-bold text-[#4a907a] mb-2 flex items-center gap-2">
              <Store className="w-4 h-4" />
              Store Status: Active
            </h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Your store is currently visible to the public. You have <strong>12 active listings</strong> and <strong>3 featured products</strong>.
            </p>
            <Button className="w-full mt-6 bg-[#4a907a] text-white hover:bg-[#3d7a66] rounded-xl h-10">
              Go to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
