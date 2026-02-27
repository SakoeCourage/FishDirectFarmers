'use client';

import React, { useState } from 'react';
import { MapPin, Plus, Navigation, Cloud, Droplets, Thermometer, Wind, Layers, Maximize2, Map as MapIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Card, Button } from '@/components/form-elements';

const FARM_SITES = [
  { id: 1, name: 'Main Pond Complex', location: 'Ada West', type: 'Earthen Ponds', size: '5.2 Acres', status: 'Active', coordinates: '5.8450° N, 0.6389° E' },
  { id: 2, name: 'Hatchery Site A', location: 'Ada East', type: 'Concrete Tanks', size: '0.8 Acres', status: 'Active', coordinates: '5.8821° N, 0.6124° E' },
  { id: 3, name: 'Expansion Site', location: 'Sege', type: 'Proposed', size: '12.5 Acres', status: 'Planning', coordinates: '5.8912° N, 0.5432° E' },
];

export default function FarmLocationPage() {
  const [selectedSite, setSelectedSite] = useState(FARM_SITES[0]);

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Farm Locations</h1>
          <p className="text-zinc-500 text-sm">Manage your aquaculture sites and environmental monitoring.</p>
        </div>
        <Button className="bg-[#4a907a] text-white hover:bg-[#3d7a66] rounded-xl flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Site
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Site List & Weather */}
        <div className="space-y-8">
          {/* Weather Widget */}
          <Card className="p-6 bg-gradient-to-br from-[#4a907a] to-[#3d7a66] text-white border-none shadow-lg shadow-[#4a907a]/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm font-medium text-white/80">Current Weather</p>
                <h3 className="text-lg font-bold">{selectedSite.location}, Ghana</h3>
              </div>
              <Cloud className="w-10 h-10 text-white/40" />
            </div>
            <div className="flex items-end gap-4 mb-6">
              <span className="text-5xl font-black">31°</span>
              <span className="text-lg font-medium mb-2">Partly Cloudy</span>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div className="text-center">
                <Droplets className="w-4 h-4 mx-auto mb-1 text-white/60" />
                <p className="text-[10px] text-white/60 uppercase font-bold">Humidity</p>
                <p className="text-sm font-bold">78%</p>
              </div>
              <div className="text-center">
                <Wind className="w-4 h-4 mx-auto mb-1 text-white/60" />
                <p className="text-[10px] text-white/60 uppercase font-bold">Wind</p>
                <p className="text-sm font-bold">12km/h</p>
              </div>
              <div className="text-center">
                <Thermometer className="w-4 h-4 mx-auto mb-1 text-white/60" />
                <p className="text-[10px] text-white/60 uppercase font-bold">Water Temp</p>
                <p className="text-sm font-bold">28.5°C</p>
              </div>
            </div>
          </Card>

          {/* Site List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Your Sites</h3>
            {FARM_SITES.map((site) => (
              <div 
                key={site.id}
                onClick={() => setSelectedSite(site)}
                className={cn(
                  "p-4 rounded-2xl border transition-all cursor-pointer group",
                  selectedSite.id === site.id 
                    ? "bg-white border-[#4a907a] shadow-md ring-1 ring-[#4a907a]/10" 
                    : "bg-white border-zinc-100 hover:border-zinc-200"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    selectedSite.id === site.id ? "bg-[#4a907a] text-white" : "bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100"
                  )}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-zinc-900">{site.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-medium">{site.type} • {site.size}</p>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter",
                    site.status === 'Active' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  )}>
                    {site.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Map View */}
        <div className="lg:col-span-2">
          <Card className="h-full min-h-[500px] p-0 overflow-hidden relative border-zinc-100 shadow-sm">
            {/* Map Placeholder */}
            <div className="absolute inset-0 bg-zinc-100 flex flex-col items-center justify-center">
              <div className="w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400">
                <MapIcon className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-medium">Interactive Map View</p>
                <p className="text-xs opacity-60">Integrating with Google Maps API...</p>
              </div>

              {/* Simulated Map Marker */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={selectedSite.id}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-[#4a907a] rounded-full flex items-center justify-center text-white shadow-xl ring-4 ring-white">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white px-3 py-1.5 rounded-lg shadow-lg border border-zinc-100 whitespace-nowrap">
                    <p className="text-xs font-bold text-zinc-900">{selectedSite.name}</p>
                    <p className="text-[10px] text-zinc-500">{selectedSite.coordinates}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-6 right-6 flex flex-col gap-2">
              <button className="w-10 h-10 bg-white rounded-xl border border-zinc-100 flex items-center justify-center text-zinc-600 shadow-sm hover:bg-zinc-50 transition-colors">
                <Layers className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 bg-white rounded-xl border border-zinc-100 flex items-center justify-center text-zinc-600 shadow-sm hover:bg-zinc-50 transition-colors">
                <Navigation className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 bg-white rounded-xl border border-zinc-100 flex items-center justify-center text-zinc-600 shadow-sm hover:bg-zinc-50 transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Site Info Overlay */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">{selectedSite.name}</h3>
                <p className="text-xs text-zinc-500">{selectedSite.location} • {selectedSite.coordinates}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="rounded-xl h-10 px-6">View Details</Button>
                <Button className="bg-[#4a907a] text-white hover:bg-[#3d7a66] rounded-xl h-10 px-6">Navigate</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
