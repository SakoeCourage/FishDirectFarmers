'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { harvestSchema, type HarvestFormValues } from '@/lib/schemas';
import { Button, Card, Modal } from '@/components/form-elements';
import { Plus, Package, Weight, DollarSign, TrendingUp } from 'lucide-react';
import { FishDirectDataTable } from '@/components/data-table';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';

const mockHarvests = [
  { id: 1, species: 'Catfish', weight: 500, unit: 'kg', price: 15, date: '2024-02-20', status: 'Available' },
  { id: 2, species: 'Tilapia', weight: 1200, unit: 'kg', price: 12, date: '2024-02-18', status: 'Sold Out' },
  { id: 3, species: 'Catfish', weight: 800, unit: 'kg', price: 14, date: '2024-02-15', status: 'Available' },
];

export default function HarvestManagement() {
  const [isAdding, setIsAdding] = useState(false);
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<HarvestFormValues>({
    resolver: zodResolver(harvestSchema),
    defaultValues: {
      unit: 'kg',
      species: 'Catfish',
      weight: 0,
      price: 0,
      location: '',
      description: '',
      harvestDate: ''
    }
  });

  const onSubmit = (data: HarvestFormValues) => {
    console.log('New Harvest:', data);
    setIsAdding(false);
    reset();
  };

  const columns = [
    { 
      field: 'id', 
      header: 'Batch ID', 
      body: (rowData: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#86efac]/10 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-[#22c55e]" />
          </div>
          <span className="font-bold">#H-{rowData.id}00{rowData.id}</span>
        </div>
      )
    },
    { field: 'species', header: 'Species', sortable: true },
    { 
      field: 'weight', 
      header: 'Weight', 
      body: (rowData: any) => `${rowData.weight} ${rowData.unit}`,
      sortable: true 
    },
    { 
      field: 'price', 
      header: 'Price', 
      body: (rowData: any) => `GH₵ ${rowData.price} / kg`,
      sortable: true 
    },
    { field: 'date', header: 'Harvest Date', sortable: true },
    { 
      field: 'status', 
      header: 'Status',
      body: (rowData: any) => (
        <span className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
          rowData.status === 'Available' ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"
        )}>
          {rowData.status}
        </span>
      )
    },
    {
      field: 'actions',
      header: 'Actions',
      body: () => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="rounded-lg">Edit</Button>
          <Button variant="outline" size="sm" className="rounded-lg">Details</Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <FishDirectDataTable 
        data={mockHarvests} 
        columns={columns} 
        filterablePlaceholder="Search harvests..."
        hasAction
        actionName="Post New Harvest"
        onAction={() => setIsAdding(true)}
        heading="Harvest Batches"
        headerNotes={
          <div className="ml-4">
            <h1 className="text-2xl font-bold tracking-tight">Harvests</h1>
            <p className="text-zinc-500 text-xs">Manage your stock and post new harvests.</p>
          </div>
        }
      />

      <Modal 
        isOpen={isAdding} 
        onClose={() => setIsAdding(false)} 
        title="Post New Harvest"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700">Species</label>
              <Controller
                name="species"
                control={control}
                render={({ field }) => (
                  <Dropdown 
                    {...field}
                    options={[{ label: 'Catfish', value: 'Catfish' }, { label: 'Tilapia', value: 'Tilapia' }]}
                    className="w-full"
                    placeholder="Select Species"
                  />
                )}
              />
              {errors.species && <small className="p-error">{errors.species.message}</small>}
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700">Harvest Date</label>
              <Controller
                name="harvestDate"
                control={control}
                render={({ field }) => (
                  <Calendar 
                    value={field.value ? new Date(field.value) : null}
                    onChange={(e) => field.onChange(e.value?.toISOString())}
                    dateFormat="yy-mm-dd"
                    showIcon
                    className="w-full"
                  />
                )}
              />
              {errors.harvestDate && <small className="p-error">{errors.harvestDate.message}</small>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700">Total Weight</label>
              <div className="p-inputgroup flex-1">
                <Controller
                  name="weight"
                  control={control}
                  render={({ field }) => (
                    <InputNumber 
                      value={field.value}
                      onValueChange={(e) => field.onChange(e.value)}
                      minFractionDigits={1}
                      placeholder="0.0"
                    />
                  )}
                />
                <Controller
                  name="unit"
                  control={control}
                  render={({ field }) => (
                    <Dropdown 
                      {...field}
                      options={[{ label: 'kg', value: 'kg' }, { label: 'tons', value: 'tons' }]}
                      className="w-24"
                    />
                  )}
                />
              </div>
              {errors.weight && <small className="p-error">{errors.weight.message}</small>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700">Price per kg (GH₵)</label>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <InputNumber 
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value)}
                    mode="currency"
                    currency="GHS"
                    locale="en-GH"
                  />
                )}
              />
              {errors.price && <small className="p-error">{errors.price.message}</small>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700">Farm Location</label>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <InputText 
                  {...field}
                  placeholder="e.g. Akosombo, Eastern Region"
                  className="w-full"
                />
              )}
            />
            {errors.location && <small className="p-error">{errors.location.message}</small>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700">Description (Optional)</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <InputTextarea 
                  {...field}
                  rows={4}
                  placeholder="Add details about quality, feeding, etc."
                  className="w-full"
                />
              )}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" className="flex-1 h-12" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button type="submit" className="flex-1 h-12">Publish Harvest</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
