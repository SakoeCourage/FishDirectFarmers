'use client';

import React from 'react';
import { Card } from '@/components/form-elements';
import { ShoppingCart, Clock, CheckCircle2, AlertCircle, Search, Filter } from 'lucide-react';
import { FishDirectDataTable } from '@/components/data-table';
import { cn } from '@/lib/utils';

const mockOrders = [
  { id: 'ORD-001', customer: 'Ama Serwaa', date: '2024-02-24', amount: 'GH₵ 450.00', status: 'Pending', species: 'Catfish' },
  { id: 'ORD-002', customer: 'Kwame Boateng', date: '2024-02-23', amount: 'GH₵ 1,200.00', status: 'Completed', species: 'Tilapia' },
  { id: 'ORD-003', customer: 'Fresh Fish Co.', date: '2024-02-22', amount: 'GH₵ 3,500.00', status: 'Processing', species: 'Catfish' },
  { id: 'ORD-004', customer: 'Mama G Kitchen', date: '2024-02-21', amount: 'GH₵ 850.00', status: 'Cancelled', species: 'Tilapia' },
];

export default function OrderManagement() {
  const columns = [
    {
      field: 'id',
      header: 'Order ID',
      body: (rowData: any) => <span className="font-bold">{rowData.id}</span>
    },
    { field: 'customer', header: 'Customer' },
    { field: 'date', header: 'Date' },
    { field: 'species', header: 'Species' },
    { field: 'amount', header: 'Amount', body: (rowData: any) => <span className="font-bold">{rowData.amount}</span> },
    {
      field: 'status',
      header: 'Status',
      body: (rowData: any) => (
        <span className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
          rowData.status === 'Completed' ? "bg-emerald-100 text-emerald-700" : 
          rowData.status === 'Pending' ? "bg-amber-100 text-amber-700" : 
          rowData.status === 'Processing' ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
        )}>
          {rowData.status}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Orders</h1>
          <p className="text-zinc-500 text-sm">Manage and track your customer orders.</p>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Total Orders', value: '156', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Completed', value: '134', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Cancelled', value: '10', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat) => (
          <Card key={stat.label} className="p-5 flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-bold text-zinc-900">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-0 overflow-hidden">
        <FishDirectDataTable 
          data={mockOrders} 
          columns={columns} 
          heading="All Orders"
          filterablePlaceholder="Search orders..."
        />
      </Card>
    </div>
  );
}
