"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRealtime } from "@/hooks/use-realtime";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Search, 
  Filter, 
  User, 
  Bike, 
  CheckCircle2, 
  AlertCircle,
  Phone,
  Mail,
  MoreHorizontal,
  Eye,
  MapPin,
  Tag
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";

// Mock Data removed

const STATUS_CONFIG = {
  KYC_SUBMITTED: { label: "KYC Submitted", color: "bg-blue-100 text-blue-700 border-blue-200" },
  UNDER_REVIEW: { label: "Under Review", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  APPROVED: { label: "Approved", color: "bg-purple-100 text-purple-700 border-purple-200" },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-700 border-red-200" },
  ACTIVE: { label: "Active", color: "bg-green-100 text-green-700 border-green-200" },
  SUSPENDED: { label: "Suspended", color: "bg-orange-100 text-orange-700 border-orange-200" },
  DISABLED: { label: "Disabled", color: "bg-gray-100 text-gray-700 border-gray-200" },
};

export default function PartnersPage() {
  const { data: riders, loading } = useRealtime("/api/partners", {
    interval: 1000,
    toastConfig: {
      new: (r) => `Rider Active Now!`,
      description: (r) => `${r.name} is now online.`
    }
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [vehicleFilter, setVehicleFilter] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Column Definitions
  const columns = useMemo(() => [
    {
      accessorKey: "fullName",
      header: "Full Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200 text-zinc-500 font-bold uppercase text-xs">
            {row.original.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <span className="font-bold text-zinc-900 dark:text-white capitalize">{row.original.name}</span>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{row.original.id}</p>
          </div>
        </div>
      )
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "vehicle",
      header: "Vehicle Type",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
           <Bike className="w-4 h-4 text-swiggy-gray" />
           <span className="font-medium text-sm">{row.original.vehicle}</span>
        </div>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const config = STATUS_CONFIG[row.original.status] || STATUS_CONFIG.DISABLED;
        return (
          <Badge className={`${config.color} border font-bold text-[10px] uppercase tracking-wider`}>
            {config.label}
          </Badge>
        );
      }
    },
    {
      accessorKey: "isOnline",
      header: "Is Online",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${row.original.isOnline ? 'bg-green-500' : 'bg-red-500'} ${row.original.isOnline ? 'animate-pulse' : ''}`} />
          <span className="text-sm font-medium">{row.original.isOnline ? 'Active Now' : 'Offline'}</span>
        </div>
      )
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link href={`/partners/${row.original.id}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-swiggy-orange hover:text-white rounded-lg">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      )
    }
  ], []);

  const table = useReactTable({
    data: riders || [],
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-[600px] w-full rounded-3xl" />
      </div>
    );
  }

  const handleAddRider = (e) => {
    e.preventDefault();
    toast.success("Delivery Partner created successfully with KYC_SUBMITTED status.");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-swiggy-navy dark:text-white tracking-tight">Delivery Partners</h1>
          <p className="text-xs sm:text-sm text-swiggy-gray font-medium mt-1">Manage partner accounts, vehicle documentation, and zone allocation</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-swiggy-orange hover:bg-swiggy-orange/90 text-white font-black px-6 rounded-xl h-10 sm:h-12 gap-2 shadow-lg shadow-swiggy-orange/20 text-xs sm:text-sm">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleAddRider}>
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-swiggy-navy">Onboard New Partner</DialogTitle>
                <DialogDescription className="font-medium text-swiggy-gray">
                  Standard registration for new delivery partners. Account starts as KYC_SUBMITTED.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 py-6 sm:py-8 border-y border-zinc-100 my-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="font-bold">Full Name</Label>
                  <Input id="fullName" placeholder="e.g. Aryan Khan" required className="h-10 sm:h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-bold">Phone Number</Label>
                  <Input id="phone" placeholder="+91 XXXXX XXXXX" required className="h-10 sm:h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold">Email Address</Label>
                  <Input id="email" type="email" placeholder="rider@example.com" required className="h-10 sm:h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleType" className="font-bold">Vehicle Type</Label>
                  <Select required>
                    <SelectTrigger className="h-10 sm:h-11">
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bike">Bike</SelectItem>
                      <SelectItem value="scooter">Scooter</SelectItem>
                      <SelectItem value="electric">Electric Bike</SelectItem>
                      <SelectItem value="bicycle">Bicycle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber" className="font-bold">Vehicle Number</Label>
                  <Input id="vehicleNumber" placeholder="e.g. MH-12-AB-1234" required className="h-10 sm:h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zone" className="font-bold">Preferred Zone</Label>
                  <Select required>
                    <SelectTrigger className="h-10 sm:h-11">
                      <SelectValue placeholder="Select Zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hsr">HSR Layout</SelectItem>
                      <SelectItem value="koramangala">Koramangala</SelectItem>
                      <SelectItem value="indiranagar">Indiranagar</SelectItem>
                      <SelectItem value="whitefield">Whitefield</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button type="button" variant="ghost" className="font-bold flex-1 sm:flex-none" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-swiggy-orange hover:bg-swiggy-orange/90 font-black px-8 flex-1 sm:flex-none">Create Partner</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters & Table Area */}
      <div className="bg-white dark:bg-zinc-950 rounded-2xl sm:rounded-3xl border border-zinc-100 dark:border-zinc-800 p-4 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-swiggy-gray" />
            <Input 
              placeholder="Search riders..." 
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 h-10 sm:h-11 border-zinc-200 rounded-lg sm:rounded-xl text-sm"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
              <SelectTrigger className="w-full sm:w-48 h-10 sm:h-11 rounded-lg sm:rounded-xl text-xs sm:text-sm">
                <Bike className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                <SelectValue placeholder="Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Vehicles</SelectItem>
                <SelectItem value="Bike">Bike</SelectItem>
                <SelectItem value="Scooter">Scooter</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 h-10 sm:h-11 rounded-lg sm:rounded-xl text-xs sm:text-sm">
                <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-xl sm:rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
          <div className="responsive-table-container">
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader className="bg-zinc-50 dark:bg-zinc-900">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest py-4 sm:py-5">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="py-4">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center text-zinc-500 font-medium italic">
                        No delivery partners found.
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
