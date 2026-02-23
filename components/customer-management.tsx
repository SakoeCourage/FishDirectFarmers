'use client';

import React from 'react';
import { Card, Button, Modal } from '@/components/form-elements';
import { Search, Mail, Phone, MapPin, MoreHorizontal, UserPlus } from 'lucide-react';
import { FishDirectDataTable } from '@/components/data-table';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import Image from 'next/image';

const mockCustomers = [
  { id: 1, name: 'Ama Serwaa', type: 'Retailer', location: 'Accra Central', orders: 12, totalSpent: 'GH₵ 4,500', lastOrder: '2 days ago' },
  { id: 2, name: 'Kwame Boateng', type: 'Processor', location: 'Tema Community 1', orders: 45, totalSpent: 'GH₵ 18,200', lastOrder: '5 hours ago' },
  { id: 3, name: 'Fresh Fish Co.', type: 'Wholesaler', location: 'Kumasi', orders: 8, totalSpent: 'GH₵ 12,000', lastOrder: '1 week ago' },
  { id: 4, name: 'Mama G Kitchen', type: 'Consumer', location: 'East Legon', orders: 5, totalSpent: 'GH₵ 850', lastOrder: '3 days ago' },
];

export default function CustomerManagement() {
  const [isAdding, setIsAdding] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState('Mobile Money');
  const [comms, setComms] = React.useState<string[]>(['Email Alerts']);

  const onCommChange = (e: any) => {
    let _comms = [...comms];
    if (e.checked) _comms.push(e.value);
    else _comms.splice(_comms.indexOf(e.value), 1);
    setComms(_comms);
  };

  const columns = [
    {
      field: 'name',
      header: 'Customer',
      body: (rowData: any) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 shrink-0">
            <Image
              src={`https://picsum.photos/seed/${rowData.id}/100`}
              alt={rowData.name}
              fill
              className="rounded-xl object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold">{rowData.name}</span>
            <span className="text-[10px] text-zinc-400 uppercase font-bold">{rowData.type}</span>
          </div>
        </div>
      )
    },
    { field: 'location', header: 'Location', sortable: true },
    { field: 'orders', header: 'Orders', sortable: true },
    { field: 'totalSpent', header: 'Total Spent', sortable: true },
    { field: 'lastOrder', header: 'Last Active', sortable: true },
    {
      field: 'actions',
      header: 'Actions',
      body: () => (
        <div className="flex gap-2">
          <button className="p-2 rounded-lg border border-zinc-100 hover:bg-zinc-50 transition-colors">
            <Mail className="w-4 h-4 text-zinc-400" />
          </button>
          <button className="p-2 rounded-lg border border-zinc-100 hover:bg-zinc-50 transition-colors">
            <Phone className="w-4 h-4 text-zinc-400" />
          </button>
          <button className="p-2 rounded-lg border border-zinc-100 hover:bg-zinc-50 transition-colors">
            <MoreHorizontal className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <FishDirectDataTable 
        data={mockCustomers} 
        columns={columns} 
        filterablePlaceholder="Search customers..."
        hasAction
        actionName="Add Customer"
        onAction={() => setIsAdding(true)}
        heading="Customer Directory"
        headerNotes={
          <div className="ml-4">
            <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
            <p className="text-zinc-500 text-xs">Manage your relationships and track buyer history.</p>
          </div>
        }
        extendedFilter={{
          enable: true,
          filters: [
            { type: 'SelectFilter', accessor: 'type', label: 'Customer Type', args: { options: [{label: 'Retailer', value: 'Retailer'}, {label: 'Wholesaler', value: 'Wholesaler'}] } },
            { type: 'TextFilter', accessor: 'location', label: 'Location' }
          ]
        }}
      />

      <Modal isOpen={isAdding} onClose={() => setIsAdding(false)} title="Add New Customer">
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700">Full Name</label>
              <InputText placeholder="e.g. John Doe" className="w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700">Customer Type</label>
              <Dropdown 
                options={[
                  { label: 'Retailer', value: 'Retailer' },
                  { label: 'Processor', value: 'Processor' },
                  { label: 'Wholesaler', value: 'Wholesaler' },
                  { label: 'Consumer', value: 'Consumer' }
                ]} 
                placeholder="Select Type"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700">Phone Number</label>
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">+233</span>
              <InputText placeholder="20 000 0000" />
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-700">Communication Preferences</label>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Checkbox inputId="cb1" value="Email Alerts" onChange={onCommChange} checked={comms.includes('Email Alerts')} />
                <label htmlFor="cb1" className="text-sm">Email Alerts</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox inputId="cb2" value="SMS Alerts" onChange={onCommChange} checked={comms.includes('SMS Alerts')} />
                <label htmlFor="cb2" className="text-sm">SMS Alerts</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox inputId="cb3" value="WhatsApp" onChange={onCommChange} checked={comms.includes('WhatsApp')} />
                <label htmlFor="cb3" className="text-sm">WhatsApp</label>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-700">Preferred Payment Method</label>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <RadioButton inputId="rb1" name="payment" value="Mobile Money" onChange={(e) => setPaymentMethod(e.value)} checked={paymentMethod === 'Mobile Money'} />
                <label htmlFor="rb1" className="text-sm">Mobile Money</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioButton inputId="rb2" name="payment" value="Bank Transfer" onChange={(e) => setPaymentMethod(e.value)} checked={paymentMethod === 'Bank Transfer'} />
                <label htmlFor="rb2" className="text-sm">Bank Transfer</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioButton inputId="rb3" name="payment" value="Cash" onChange={(e) => setPaymentMethod(e.value)} checked={paymentMethod === 'Cash'} />
                <label htmlFor="rb3" className="text-sm">Cash</label>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" className="flex-1 h-12" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button type="button" className="flex-1 h-12" onClick={() => setIsAdding(false)}>Save Customer</Button>
          </div>
        </form>
      </Modal>


      <Card className="bg-zinc-900 text-white p-8 overflow-hidden relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#86efac] rounded-full blur-[120px] opacity-10" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Grow your customer base</h3>
            <p className="text-zinc-400 max-w-md">Connect with more retailers and processors in your region using our GIS mapping tool.</p>
          </div>
          <Button variant="primary" className="h-12 px-8 font-bold">
            Explore Map
          </Button>
        </div>
      </Card>
    </div>
  );
}
