'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postToMarketplaceSchema, type PostToMarketplaceFormValues } from '@/lib/schemas';
import { Button, Card, Input, TextArea, Select, Modal } from '@/components/form-elements';
import { 
  Plus, 
  Store, 
  Package, 
  Tag, 
  Image as ImageIcon, 
  Trash2, 
  Edit3, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Box,
  Search,
  Download,
  Minus,
  Eye,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';

// Mock data for available harvests
const AVAILABLE_HARVESTS = [
  { id: 1, species: 'Catfish', weight: 500, unit: 'kg', price: 15, date: '2024-02-20', location: 'Akosombo' },
  { id: 2, species: 'Tilapia', weight: 1200, unit: 'kg', price: 12, date: '2024-02-18', location: 'Kpong' },
  { id: 3, species: 'Catfish', weight: 800, unit: 'kg', price: 14, date: '2024-02-15', location: 'Ada' },
];

// Mock data for initial inventory
const INITIAL_INVENTORY = [
  {
    id: '1',
    name: 'Fresh Catfish (Large)',
    category: 'Fish',
    quantity: 150,
    unit: 'kg',
    price: 45.00,
    status: 'Active',
    image: 'https://picsum.photos/seed/catfish/400/300',
    description: 'Freshly harvested large catfish, average weight 1.5kg per fish.'
  }
];

export default function MarketplacePage() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [speciesFilter, setSpeciesFilter] = useState<string | null>(null);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<any>>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<PostToMarketplaceFormValues>({
    resolver: zodResolver(postToMarketplaceSchema),
  });

  const selectedHarvestId = watch('harvestId');
  const selectedHarvest = useMemo(() => 
    AVAILABLE_HARVESTS.find(h => h.id === selectedHarvestId),
    [selectedHarvestId]
  );

  const filteredHarvests = useMemo(() => {
    if (!speciesFilter) return AVAILABLE_HARVESTS;
    return AVAILABLE_HARVESTS.filter(h => h.species === speciesFilter);
  }, [speciesFilter]);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const [toastMsg, setToastMsg] = useState<{ severity: 'success' | 'warn' | 'error' | 'info', summary: string, detail: string } | null>(null);

  React.useEffect(() => {
    if (toastMsg) {
      toast.current?.show(toastMsg);
      setToastMsg(null);
    }
  }, [toastMsg]);

  const closeModal = React.useCallback(() => {
    setIsModalOpen(false);
    reset();
    setPreviewImage(null);
    setEditingItem(null);
    setSpeciesFilter(null);
  }, [reset]);

  const onSubmit = React.useCallback((data: PostToMarketplaceFormValues) => {
    const harvest = AVAILABLE_HARVESTS.find(h => h.id === data.harvestId);
    
    if (!harvest) return;

    if (data.quantity > harvest.weight) {
      setToastMsg({ 
        severity: 'error', 
        summary: 'Insufficient Stock', 
        detail: `Only ${harvest.weight}${harvest.unit} available in this harvest batch.` 
      });
      return;
    }

    const newItem = {
      id: crypto.randomUUID(),
      name: `${harvest.species} Batch #${harvest.id}`,
      category: 'Fish',
      quantity: data.quantity,
      unit: harvest.unit,
      price: data.price,
      status: data.quantity < 10 ? 'Low Stock' : 'Active',
      image: previewImage || 'https://picsum.photos/seed/newitem/400/300',
      description: `Harvested from ${harvest.location} on ${harvest.date}.`
    };

    setInventory(prev => [newItem, ...prev]);
    setToastMsg({ severity: 'success', summary: 'Posted', detail: 'Harvest successfully listed on marketplace' });
    closeModal();
  }, [previewImage, closeModal]);

  const deleteItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
    setToastMsg({ severity: 'warn', summary: 'Deleted', detail: 'Item removed from inventory' });
  };

  const updateQuantity = (id: string, delta: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return {
          ...item,
          quantity: newQty,
          status: newQty < 10 ? 'Low Stock' : 'Active'
        };
      }
      return item;
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  // Templates for DataTable
  const imageTemplate = (rowData: any) => {
    return (
      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-zinc-100 shadow-sm">
        <Image 
          src={rowData.image} 
          alt={rowData.name} 
          fill 
          className="object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  };

  const priceTemplate = (rowData: any) => {
    return (
      <div className="font-bold text-zinc-900">
        GH₵ {rowData.price.toFixed(2)}
        <span className="text-[10px] text-zinc-400 font-medium ml-1">/ {rowData.unit}</span>
      </div>
    );
  };

  const statusTemplate = (rowData: any) => {
    const isActive = rowData.status === 'Active';
    return (
      <span className={cn(
        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
        isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
      )}>
        {rowData.status}
      </span>
    );
  };

  const quantityTemplate = (rowData: any) => {
    return (
      <div className="flex items-center gap-3">
        <button 
          onClick={() => updateQuantity(rowData.id, -1)}
          className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center hover:bg-zinc-100 transition-colors text-zinc-500"
        >
          <Minus className="w-3 h-3" />
        </button>
        <div className="flex flex-col items-center min-w-[40px]">
          <span className="font-bold text-zinc-900">{rowData.quantity}</span>
          <span className="text-[10px] text-zinc-400 uppercase">{rowData.unit}</span>
        </div>
        <button 
          onClick={() => updateQuantity(rowData.id, 1)}
          className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center hover:bg-zinc-100 transition-colors text-zinc-500"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    );
  };

  const actionTemplate = (rowData: any) => {
    return (
      <div className="flex items-center gap-2">
        <button 
          className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-600 transition-colors"
          title="View in Marketplace"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
        <button 
          onClick={() => deleteItem(rowData.id)}
          className="p-2 hover:bg-red-50 rounded-xl text-zinc-600 hover:text-red-500 transition-colors"
          title="Delete Item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const header = (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <InputText 
          value={globalFilterValue} 
          onChange={onGlobalFilterChange} 
          placeholder="Search inventory..." 
          className="w-full pl-10 pr-4 h-11 bg-zinc-50 border-none rounded-xl text-sm"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          onClick={exportCSV}
          className="h-11 rounded-xl border-zinc-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <Toast ref={toast} />
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Marketplace Manager</h1>
          <p className="text-zinc-500 mt-1">List your available harvests on the marketplace.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#4a907a] text-white hover:bg-[#3d7a66] h-12 px-6 rounded-2xl shadow-lg shadow-[#4a907a]/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          Post to Marketplace
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 text-white border-none p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <Store className="w-6 h-6 text-[#4a907a]" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm font-medium">Active Listings</p>
              <h3 className="text-2xl font-bold">{inventory.length}</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#4a907a]/10 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#4a907a]" />
            </div>
            <div>
              <p className="text-zinc-500 text-sm font-medium">Total Inventory Value</p>
              <h3 className="text-2xl font-bold">
                GH₵ {inventory.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString()}
              </h3>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-zinc-500 text-sm font-medium">Low Stock Alerts</p>
              <h3 className="text-2xl font-bold">
                {inventory.filter(item => item.status === 'Low Stock').length}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Inventory Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900">Marketplace Inventory</h2>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Box className="w-4 h-4" />
            <span>{inventory.length} items listed</span>
          </div>
        </div>

        <DataTable 
          ref={dt}
          value={inventory} 
          header={header}
          filters={filters}
          globalFilterFields={['name', 'category', 'description']}
          paginator 
          rows={10} 
          className="p-datatable-sm"
          emptyMessage="No marketplace items found."
          responsiveLayout="scroll"
          sortMode="multiple"
        >
          <Column body={imageTemplate} header="Image" style={{ width: '80px' }} />
          <Column field="name" header="Product Name" sortable />
          <Column field="category" header="Category" sortable />
          <Column body={quantityTemplate} header="Quantity" sortable field="quantity" />
          <Column body={priceTemplate} header="Price" sortable field="price" />
          <Column body={statusTemplate} header="Status" sortable field="status" />
          <Column body={actionTemplate} header="Actions" style={{ width: '120px' }} />
        </DataTable>
      </div>

      {/* Post to Marketplace Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title="Post Harvest to Marketplace"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-700">Select Harvest Batch</label>
              <div className="flex items-center gap-2">
                <Filter className="w-3 h-3 text-zinc-400" />
                <Select 
                  options={[
                    { label: 'All Species', value: '' },
                    { label: 'Catfish', value: 'Catfish' },
                    { label: 'Tilapia', value: 'Tilapia' }
                  ]}
                  value={speciesFilter || ''}
                  onChange={(e) => setSpeciesFilter(e.target.value)}
                  className="h-8 text-[10px] min-w-[120px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto pr-2 no-scrollbar">
              {filteredHarvests.map((harvest) => (
                <div 
                  key={harvest.id}
                  onClick={() => {
                    setValue('harvestId', harvest.id);
                    setValue('price', harvest.price);
                  }}
                  className={cn(
                    "p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group",
                    selectedHarvestId === harvest.id 
                      ? "bg-[#4a907a]/5 border-[#4a907a] shadow-sm" 
                      : "bg-white border-zinc-100 hover:border-zinc-200"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                      selectedHarvestId === harvest.id ? "bg-[#4a907a] text-white" : "bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100"
                    )}>
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">{harvest.species} Batch #{harvest.id}</p>
                      <p className="text-[10px] text-zinc-500 font-medium">{harvest.location} • {harvest.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-zinc-900">{harvest.weight} {harvest.unit}</p>
                    <p className="text-[10px] text-zinc-400 font-medium">Available</p>
                  </div>
                </div>
              ))}
            </div>
            {errors.harvestId && <p className="text-xs text-red-500">{errors.harvestId.message}</p>}
          </div>

          <AnimatePresence>
            {selectedHarvest && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-6 pt-4 border-t border-dashed border-zinc-100"
              >
                <div className="grid grid-cols-2 gap-6">
                  <Input 
                    label={`Quantity to Post (${selectedHarvest.unit})`}
                    type="number"
                    step="0.1"
                    placeholder={`Max ${selectedHarvest.weight}`}
                    {...register('quantity', { valueAsNumber: true })}
                    error={errors.quantity?.message}
                  />
                  <Input 
                    label="Marketplace Price (GH₵)" 
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('price', { valueAsNumber: true })}
                    error={errors.price?.message}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Product Image</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-2xl bg-zinc-50 border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden group">
                      {previewImage ? (
                        <Image 
                          src={previewImage} 
                          alt="Preview" 
                          fill 
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-zinc-300" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-zinc-900">Upload product photo</p>
                      <p className="text-[10px] text-zinc-500 mt-1">PNG, JPG or WEBP. Max 5MB.</p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 h-8 text-[10px] relative"
                      >
                        Choose File
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    Posting <strong>{watch('quantity') || 0} {selectedHarvest.unit}</strong> of <strong>{selectedHarvest.species}</strong>. 
                    Remaining harvest stock will be <strong>{(selectedHarvest.weight - (watch('quantity') || 0)).toFixed(1)} {selectedHarvest.unit}</strong>.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 h-12 rounded-xl"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedHarvest}
              className="flex-1 h-12 bg-[#4a907a] text-white hover:bg-[#3d7a66] rounded-xl disabled:opacity-50"
            >
              Post to Marketplace
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

