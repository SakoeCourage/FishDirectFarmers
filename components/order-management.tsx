'use client';

import React, { useState } from 'react';
import { Card, Modal, Button } from '@/components/form-elements';
import { ShoppingCart, Clock, CheckCircle2, AlertCircle, Search, Filter, Eye, UserPlus } from 'lucide-react';
import { FishDirectDataTable } from '@/components/data-table';
import { cn } from '@/lib/utils';

const mockOrders = [
  { id: 'ORD-001', customer: 'Ama Serwaa', date: '2024-02-24', amount: 'GH₵ 450.00', status: 'Pending', species: 'Catfish', items: '20kg Smoked Catfish', phone: '+233 24 123 4567' },
  { id: 'ORD-002', customer: 'Kwame Boateng', date: '2024-02-23', amount: 'GH₵ 1,200.00', status: 'Completed', species: 'Tilapia', items: '50kg Fresh Tilapia', phone: '+233 20 987 6543' },
  { id: 'ORD-003', customer: 'Fresh Fish Co.', date: '2024-02-22', amount: 'GH₵ 3,500.00', status: 'Processing', species: 'Catfish', items: '100kg Fingerlings', phone: '+233 55 555 5555' },
  { id: 'ORD-004', customer: 'Mama G Kitchen', date: '2024-02-21', amount: 'GH₵ 850.00', status: 'Cancelled', species: 'Tilapia', items: '30kg Large Tilapia', phone: '+233 27 111 2222' },
];

export default function OrderManagement() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

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
    },
    {
      field: 'actions',
      header: 'Actions',
      body: (rowData: any) => (
        <button 
          onClick={() => handleViewOrder(rowData)}
          className="p-2 rounded-lg border border-zinc-100 hover:bg-zinc-50 transition-colors text-zinc-400 hover:text-[#4a907a]"
        >
          <Eye className="w-4 h-4" />
        </button>
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

      <Card className="p-0 overflow-hidden">
        <FishDirectDataTable 
          data={mockOrders} 
          columns={columns} 
          heading="All Orders"
          filterablePlaceholder="Search orders..."
          extendedFilter={{
            enable: true,
            filters: [
              { 
                type: 'SelectFilter', 
                accessor: 'status', 
                label: 'Status', 
                args: { 
                  options: [
                    { label: 'Pending', value: 'Pending' },
                    { label: 'Processing', value: 'Processing' },
                    { label: 'Completed', value: 'Completed' },
                    { label: 'Cancelled', value: 'Cancelled' }
                  ] 
                } 
              }
            ]
          }}
        />
      </Card>

      <Modal 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        title={`Order Details: ${selectedOrder?.id}`}
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Customer</p>
                <p className="font-bold text-lg">{selectedOrder.customer}</p>
                <p className="text-sm text-zinc-500">{selectedOrder.phone}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Order Date</p>
                <p className="font-bold">{selectedOrder.date}</p>
              </div>
            </div>

            <div className="p-4 bg-zinc-50 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold">Items</p>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  selectedOrder.status === 'Completed' ? "bg-emerald-100 text-emerald-700" : 
                  selectedOrder.status === 'Pending' ? "bg-amber-100 text-amber-700" : 
                  selectedOrder.status === 'Processing' ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                )}>
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-zinc-600">{selectedOrder.items}</p>
                <p className="font-bold">{selectedOrder.amount}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex flex-col gap-3">
              <Button className="w-full h-12 flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                Add Customer as Consumer
              </Button>
              <Button variant="outline" className="w-full h-12" onClick={() => setIsDetailsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
