'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Search, Plus, Filter, RotateCcw, ChevronLeft, ChevronRight, AlertCircle, Loader2, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

// --- Types ---

export type FilterType = 'DateFilter' | 'SelectFilter' | 'TextFilter' | 'DateRangeFilter' | 'MonthYearFilter';

export interface FilterParam {
  type: FilterType;
  accessor: string;
  label: string;
  args?: any;
}

export interface ColumnDef<TData> {
  field: string;
  header: string;
  body?: (data: TData) => React.ReactNode;
  sortable?: boolean;
  style?: React.CSSProperties;
}

export interface SortConfig {
  key: string;
  accessor: string;
  options: { key: string; value: string }[];
}

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data?: TData[];
  dataSourceUrl?: string;
  apiCallType?: 'GET' | 'POST';
  postData?: any;
  filterable?: string;
  filterablePlaceholder?: string;
  sortableColumns?: SortConfig[];
  enableTableFilter?: boolean;
  extendedFilter?: {
    enable: boolean;
    filters: FilterParam[];
  };
  enablePaginator?: boolean;
  hasAction?: boolean;
  actionName?: string;
  onAction?: () => void;
  actionOptions?: { asLink: boolean; link: string };
  heading?: string | React.ReactNode;
  headerNotes?: React.ReactNode;
  isFilterVisibleOnStart?: boolean;
  showErrorAsBanner?: boolean;
  emptyDataText?: string;
  persistFiltersInUrl?: boolean;
  dataMapper?: (response: any) => any;
  parsePayload?: (payload: any) => any;
  getQueryParamValue?: (key: string) => string | null;
  className?: string;
}

// --- Helper Functions ---

export const resetTableData = () => {
  document.dispatchEvent(new Event('tableRefreshEvent'));
};

export const resetDefaultData = () => {
  document.dispatchEvent(new Event('tableResetEvent'));
};

export const scrollDataTableToTop = () => {
  const table = document.querySelector('.p-datatable-wrapper');
  if (table) table.scrollTo({ top: 0, behavior: 'smooth' });
};

// --- Main Component ---

export function FishDirectDataTable<TData>({
  columns,
  data: staticData,
  dataSourceUrl,
  apiCallType = 'GET',
  postData: initialPostData = {},
  filterable,
  filterablePlaceholder,
  sortableColumns,
  enableTableFilter = true,
  extendedFilter,
  enablePaginator = true,
  hasAction,
  actionName,
  onAction,
  actionOptions,
  heading,
  headerNotes,
  isFilterVisibleOnStart = false,
  showErrorAsBanner = true,
  emptyDataText = 'No Data.',
  persistFiltersInUrl = true,
  dataMapper,
  parsePayload,
  getQueryParamValue,
  className,
}: DataTableProps<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // --- State ---
  const [isFilterVisible, setIsFilterVisible] = useState(isFilterVisibleOnStart);
  const [globalSearch, setGlobalSearch] = useState('');
  const [filters, setFilters] = useState<any>(() => {
    if (persistFiltersInUrl) {
      const urlFilters = searchParams.get('filters');
      if (urlFilters) {
        try {
          return JSON.parse(urlFilters);
        } catch (e) {
          return {};
        }
      }
    }
    return apiCallType === 'POST' ? initialPostData : {};
  });

  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });

  // --- API Client ---
  const apiClient = useMemo(() => {
    const instance = axios.create();
    // In a real app, inject token here
    // instance.interceptors.request.use((config) => {
    //   config.headers.Authorization = `Bearer ${token}`;
    //   return config;
    // });
    return instance;
  }, []);

  // --- Data Fetching ---
  const fetchTableData = async (currentFilters: any, currentPagination: any) => {
    if (staticData) return { content: staticData, totalElements: staticData.length, totalPages: 1, pageNumber: 1 };
    if (!dataSourceUrl) return { content: [], totalElements: 0, totalPages: 0, pageNumber: 1 };

    const payload = {
      ...currentFilters,
      page: currentPagination.page,
      size: currentPagination.size,
    };

    const finalPayload = parsePayload ? parsePayload(payload) : payload;

    let response;
    if (apiCallType === 'POST') {
      response = await apiClient.post(dataSourceUrl, finalPayload);
    } else {
      response = await apiClient.get(dataSourceUrl, { params: finalPayload });
    }

    const rawData = dataMapper ? dataMapper(response.data) : response.data;
    
    // Validate shape
    return {
      content: rawData.content || [],
      pageNumber: rawData.pageNumber || 1,
      totalPages: rawData.totalPages || 0,
      totalElements: rawData.totalElements || 0,
    };
  };

  const queryKey = [dataSourceUrl, filters, pagination, apiCallType];

  const { data: tableData, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchTableData(filters, pagination),
    enabled: !!dataSourceUrl || !!staticData,
  });

  const mutation = useMutation({
    mutationFn: ({ newFilters, newPagination }: { newFilters: any; newPagination: any }) => 
      fetchTableData(newFilters, newPagination),
    onSuccess: (newData) => {
      queryClient.setQueryData(queryKey, newData);
    },
  });

  // --- Central Filter Handler ---
  const handleUrlQuery = useCallback((accessor: string | string[], value: any | any[]) => {
    setFilters((prev: any) => {
      const nextFilters = { ...prev };
      
      if (Array.isArray(accessor)) {
        accessor.forEach((acc, i) => {
          if (value[i] === null || value[i] === undefined || value[i] === '') {
            delete nextFilters[acc];
          } else {
            nextFilters[acc] = value[i];
          }
        });
      } else {
        if (value === null || value === undefined || value === '') {
          delete nextFilters[accessor];
        } else {
          nextFilters[accessor] = value;
        }
      }

      // Reset page on filter change unless it's a page change
      const isPageChange = accessor === 'page' || (Array.isArray(accessor) && accessor.includes('page'));
      const nextPagination = {
        ...pagination,
        page: isPageChange ? (Array.isArray(accessor) ? value[accessor.indexOf('page')] : value) : 1,
      };

      if (!isPageChange) setPagination(nextPagination);

      mutation.mutate({ newFilters: nextFilters, newPagination: nextPagination });
      return nextFilters;
    });
  }, [pagination, mutation]);

  // --- Event Listeners & URL Sync ---
  useEffect(() => {
    if (persistFiltersInUrl) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('filters', JSON.stringify(filters));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [filters, persistFiltersInUrl, router, pathname, searchParams]);

  useEffect(() => {
    const handleRefresh = () => refetch();
    const handleReset = () => {
      const resetFilters = apiCallType === 'POST' ? initialPostData : {};
      setFilters(resetFilters);
      setPagination({ page: 1, size: 10 });
      setGlobalSearch('');
      mutation.mutate({ newFilters: resetFilters, newPagination: { page: 1, size: 10 } });
    };

    document.addEventListener('tableRefreshEvent', handleRefresh);
    document.addEventListener('tableResetEvent', handleReset);
    return () => {
      document.removeEventListener('tableRefreshEvent', handleRefresh);
      document.removeEventListener('tableResetEvent', handleReset);
    };
  }, [refetch, initialPostData, apiCallType, mutation]);

  // --- Render Helpers ---
  const renderFilterInput = (filter: FilterParam) => {
    const value = filters[filter.accessor];

    switch (filter.type) {
      case 'TextFilter':
        return (
          <InputText
            value={value || ''}
            onChange={(e) => handleUrlQuery(filter.accessor, e.target.value)}
            placeholder={filter.label}
            className="w-full"
            {...filter.args}
          />
        );
      case 'SelectFilter':
        return (
          <Dropdown
            value={value ?? null}
            options={filter.args?.options || []}
            onChange={(e) => handleUrlQuery(filter.accessor, e.value)}
            placeholder={filter.label}
            className="w-full"
            {...filter.args}
          />
        );
      case 'DateFilter':
        return (
          <Calendar
            value={value ? new Date(value) : null}
            onChange={(e) => handleUrlQuery(filter.accessor, e.value?.toISOString())}
            placeholder={filter.label}
            className="w-full"
            showIcon
            {...filter.args}
          />
        );
      case 'DateRangeFilter':
        return (
          <Calendar
            value={value}
            onChange={(e) => handleUrlQuery(filter.accessor, e.value)}
            selectionMode="range"
            placeholder={filter.label}
            className="w-full"
            showIcon
            {...filter.args}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* 1. Error Banner */}
      {isError && showErrorAsBanner && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <div className="flex-1 text-sm font-medium">
            Failed to load data. {(error as any)?.message}
          </div>
          <Button 
            icon={<RotateCcw className="w-4 h-4" />} 
            className="p-button-text p-button-sm text-red-700" 
            onClick={() => refetch()} 
          />
        </div>
      )}

      {/* 2. Toolbar Panel */}
      {(enableTableFilter || (extendedFilter?.enable) || hasAction) && (
        <div className="bg-white rounded-3xl p-3 shadow-sm border border-zinc-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-[300px]">
            {filterablePlaceholder && (
              <div className="relative flex-1 max-w-md flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-zinc-400 z-10" />
                <InputText
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlQuery('search', globalSearch)}
                  placeholder={filterablePlaceholder}
                  className="pl-10 pr-10 w-full rounded-2xl h-11 border-zinc-200 focus:border-[#22c55e] transition-all"
                />
                <Button 
                  icon={<Search className="w-4 h-4" />} 
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-button-text p-button-sm rounded-xl h-8 w-8 flex items-center justify-center text-zinc-400 hover:text-[#22c55e]"
                  onClick={() => handleUrlQuery('search', globalSearch)}
                />
              </div>
            )}
            
            {extendedFilter?.enable && (
              <Button 
                icon={<Filter className="w-4 h-4 mr-2" />} 
                label={isFilterVisible ? "Hide Filters" : "Show Filters"}
                className={cn(
                  "p-button-outlined p-button-sm rounded-2xl border-zinc-200 text-zinc-600 font-bold h-11 px-4",
                  isFilterVisible && "bg-zinc-50 border-zinc-300"
                )}
                onClick={() => setIsFilterVisible(!isFilterVisible)}
              />
            )}

            {headerNotes}
          </div>

          <div className="flex items-center gap-3">
            {hasAction && (
              actionOptions?.asLink ? (
                <Button 
                  label={actionName} 
                  icon={<Plus className="w-4 h-4 mr-2" />} 
                  className="p-button-sm rounded-2xl bg-[#86efac] hover:bg-[#4ade80] text-black border-none font-bold h-11 px-6 transition-colors shadow-sm"
                  onClick={() => router.push(actionOptions.link)}
                />
              ) : (
                <Button 
                  label={actionName} 
                  icon={<Plus className="w-4 h-4 mr-2" />} 
                  className="p-button-sm rounded-2xl bg-[#86efac] hover:bg-[#4ade80] text-black border-none font-bold h-11 px-6 transition-colors shadow-sm"
                  onClick={onAction}
                />
              )
            )}
          </div>
        </div>
      )}

      {/* 3. Extended Filter Panel */}
      {extendedFilter?.enable && isFilterVisible && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {extendedFilter.filters.map((filter) => (
              <div key={filter.accessor} className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{filter.label}</label>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-6 pt-6 border-t border-zinc-50">
            <Button 
              label="Reset Filters" 
              icon={<RotateCcw className="w-4 h-4 mr-2" />} 
              className="p-button-text p-button-sm text-zinc-400 font-bold"
              onClick={resetDefaultData}
            />
          </div>
        </div>
      )}

      {/* 4. Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
        {heading && (
          <div className="p-6 border-b border-zinc-50 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#86efac]" />
            <h3 className="font-bold text-lg">{heading}</h3>
          </div>
        )}

        <div className="relative">
          <DataTable
            value={tableData?.content || []}
            loading={isLoading || mutation.isPending}
            emptyMessage={
              <div className="py-20 flex flex-col items-center justify-center text-zinc-400">
                <Package className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-medium">{emptyDataText}</p>
                {dataSourceUrl && (
                  <Button 
                    label="Reload" 
                    icon={<RotateCcw className="w-4 h-4 mr-2" />} 
                    className="p-button-text p-button-sm mt-4 text-[#22c55e]"
                    onClick={() => refetch()}
                  />
                )}
              </div>
            }
            className="p-datatable-sm"
            pt={{
              thead: { className: 'bg-[#4a907a]/10' },
              headerRow: { className: 'border-none' },
              column: {
                headerCell: { className: 'bg-transparent text-zinc-500 text-[10px] font-bold uppercase tracking-widest py-4 px-6 border-b border-zinc-100' },
                bodyCell: { className: 'py-4 px-6 text-sm text-zinc-900 border-b border-zinc-50' }
              }
            }}
          >
            {columns.map((col) => (
              <Column
                key={col.field}
                field={col.field}
                header={
                  <div className="flex items-center gap-2">
                    {col.header}
                    {sortableColumns?.find(s => s.key === col.field) && (
                      <Dropdown
                        options={sortableColumns.find(s => s.key === col.field)?.options}
                        onChange={(e) => handleUrlQuery(sortableColumns.find(s => s.key === col.field)!.accessor, e.value)}
                        className="p-column-filter p-button-text p-0 border-none shadow-none bg-transparent w-6"
                        dropdownIcon="pi pi-sort-alt"
                      />
                    )}
                  </div>
                }
                body={col.body}
                style={col.style}
              />
            ))}
          </DataTable>
        </div>

        {/* 5. Pagination Bar */}
        {enablePaginator && tableData && tableData.totalElements > 0 && (
          <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-400 uppercase">Rows:</span>
                <Dropdown
                  value={pagination.size}
                  options={[10, 20, 30, 40, 50, 100]}
                  onChange={(e) => {
                    setPagination(prev => ({ ...prev, size: e.value }));
                    handleUrlQuery('size', e.value);
                  }}
                  className="p-button-text p-button-sm border-none bg-transparent text-xs font-bold"
                />
              </div>
              <div className="text-xs font-bold text-zinc-400 uppercase">
                Page {tableData.pageNumber} of {tableData.totalPages} • {tableData.totalElements} items
              </div>
            </div>

            <div className="flex items-center gap-2">
              {(isLoading || mutation.isPending) && (
                <Loader2 className="w-4 h-4 animate-spin text-[#22c55e] mr-2" />
              )}
              <Button 
                icon={<ChevronLeft className="w-4 h-4" />} 
                disabled={tableData.pageNumber <= 1 || isLoading || mutation.isPending}
                className="p-button-text p-button-sm rounded-xl text-zinc-600"
                onClick={() => {
                  handleUrlQuery('page', tableData.pageNumber - 1);
                  scrollDataTableToTop();
                }}
              />
              <Button 
                icon={<ChevronRight className="w-4 h-4" />} 
                disabled={tableData.pageNumber >= tableData.totalPages || isLoading || mutation.isPending}
                className="p-button-text p-button-sm rounded-xl text-zinc-600"
                onClick={() => {
                  handleUrlQuery('page', tableData.pageNumber + 1);
                  scrollDataTableToTop();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Re-export the original name for backward compatibility if needed, 
// but the spec suggests this new implementation is the one to use.
export const FishDirectDataTableLegacy = FishDirectDataTable;
