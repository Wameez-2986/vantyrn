"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRealtime } from "@/hooks/use-realtime";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Filter, 
  User, 
  Mail,
  Phone,
  Eye,
  Calendar,
  ShoppingBag,
  UserCheck,
  UserMinus
} from "lucide-react";
import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender, 
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

// Mock Data removed

export default function CustomersPage() {
  const { data: customers, loading } = useRealtime("/api/customers", {
    toastConfig: {
      new: (c) => `New Customer Signup!`,
      description: (c) => `${c.name} just joined.`
    }
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const filteredData = useMemo(() => {
    if (!customers) return [];
    return customers.filter(item => {
      if (typeFilter === "GUEST") return item.isGuest;
      if (typeFilter === "REGISTERED") return !item.isGuest;
      return true;
    });
  }, [customers, typeFilter]);

  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: "Customer ID",
      cell: ({ row }) => (
        <span className="font-bold text-zinc-400 uppercase tracking-widest text-[10px]">{row.original.id}</span>
      )
    },
    {
      accessorKey: "name",
      header: "Full Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center border border-zinc-200 text-zinc-500 font-bold uppercase text-xs shadow-sm">
            {row.original.isGuest ? <UserMinus className="w-4 h-4 text-zinc-400" /> : row.original.name.charAt(0)}
          </div>
          <div>
            <span className="font-bold text-zinc-900 dark:text-white capitalize leading-none">{row.original.name}</span>
            {row.original.isGuest && <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mt-0.5">Guest Account</p>}
          </div>
        </div>
      )
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-swiggy-navy">{row.original.phone}</span>
      )
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-swiggy-navy lowercase">{row.original.email}</span>
      )
    },
    {
      accessorKey: "registeredAt",
      header: "Registered At",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3 text-swiggy-gray" />
          <span className="text-xs font-bold text-swiggy-gray uppercase">{new Date(row.original.registeredAt).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      accessorKey: "totalOrders",
      header: "Total Orders",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-black border-zinc-200 text-swiggy-navy bg-zinc-50 rounded-lg px-3">
          {row.original.orders}
        </Badge>
      )
    },
    {
      accessorKey: "spent",
      header: "Total Spent",
      cell: ({ row }) => (
        <span className="font-black text-swiggy-navy">{row.original.spent}</span>
      )
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link href={`/customers/${row.original.id}`}>
          <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-swiggy-orange hover:text-white rounded-xl transition-all shadow-sm border border-zinc-50 hover:border-transparent">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      )
    }
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });


  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-swiggy-navy dark:text-white tracking-tight">Customer Directory</h1>
          <p className="text-xs sm:text-sm text-swiggy-gray font-medium mt-1">Manage foodies, guest users, and loyalty data</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="p-1 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl sm:rounded-2xl flex gap-1 shadow-sm overflow-x-auto scrollbar-hide">
              <Button 
                variant={typeFilter === 'ALL' ? 'secondary' : 'ghost'} 
                size="sm" 
                className={`rounded-lg sm:rounded-xl px-4 font-bold text-xs sm:text-sm ${typeFilter === 'ALL' ? 'bg-swiggy-orange text-white hover:bg-swiggy-orange/90' : ''}`}
                onClick={() => setTypeFilter('ALL')}
              >
                All
              </Button>
              <Button 
                variant={typeFilter === 'REGISTERED' ? 'secondary' : 'ghost'} 
                size="sm" 
                className={`rounded-lg sm:rounded-xl px-4 font-bold text-xs sm:text-sm ${typeFilter === 'REGISTERED' ? 'bg-swiggy-orange text-white hover:bg-swiggy-orange/90' : ''}`}
                onClick={() => setTypeFilter('REGISTERED')}
              >
                Registered
              </Button>
              <Button 
                variant={typeFilter === 'GUEST' ? 'secondary' : 'ghost'} 
                size="sm" 
                className={`rounded-lg sm:rounded-xl px-4 font-bold text-xs sm:text-sm ${typeFilter === 'GUEST' ? 'bg-swiggy-orange text-white hover:bg-swiggy-orange/90' : ''}`}
                onClick={() => setTypeFilter('GUEST')}
              >
                Guest
              </Button>
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 rounded-2xl sm:rounded-3xl border border-zinc-100 dark:border-zinc-800 p-4 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-swiggy-gray" />
            <Input 
              placeholder="Search customers..." 
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 h-10 sm:h-12 border-zinc-200 rounded-lg sm:rounded-xl text-sm"
            />
          </div>
        </div>

        <div className="rounded-xl sm:rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
          <div className="responsive-table-container">
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="text-zinc-500 font-black uppercase text-[10px] tracking-widest py-4 sm:py-5">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [1, 2, 3, 4, 5].map((i) => (
                      <TableRow key={i}>
                        {columns.map((_, j) => (
                          <TableCell key={j} className="py-4 border-b border-zinc-50">
                            <Skeleton className="h-6 w-full rounded" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="py-4 border-b border-zinc-50 last:border-0">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-32 text-center text-zinc-500 font-medium italic">
                        <div className="flex flex-col items-center gap-2">
                           <UserMinus className="w-8 h-8 opacity-20" />
                           No customers found matching your criteria.
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <p className="text-xs sm:text-sm font-bold text-swiggy-gray">
            Showing <span className="text-swiggy-navy">{table.getState().pagination.pageIndex + 1}</span> of <span className="text-swiggy-navy">{table.getPageCount()}</span> pages
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => table.previousPage()} 
              disabled={!table.getCanPreviousPage()}
              className="font-bold h-10 sm:h-11 px-4 sm:px-6 rounded-lg sm:rounded-xl border-zinc-200 flex-1 sm:flex-none text-xs sm:text-sm"
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => table.nextPage()} 
              disabled={!table.getCanNextPage()}
              className="font-bold h-10 sm:h-11 px-4 sm:px-6 rounded-lg sm:rounded-xl border-zinc-200 flex-1 sm:flex-none text-xs sm:text-sm"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
