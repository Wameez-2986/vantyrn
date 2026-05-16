"use client";

import React, { useState, useEffect } from "react";
import { useRealtime } from "@/hooks/use-realtime";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle,
  Bike
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";

// Mock Data removed

export default function PartnerKYCQueuePage() {
  const { data: queue, loading } = useRealtime("/api/partners/kyc");

  if (loading || !queue) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-swiggy-navy dark:text-white tracking-tight">Partner KYC Queue</h1>
          <p className="text-sm text-swiggy-gray font-medium mt-1">Review and approve delivery partner documentation</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-swiggy-orange/10 text-swiggy-orange border-swiggy-orange/20 px-4 py-2 font-black rounded-full text-xs">
            {queue.length} Pending Reviews
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-3xl border-zinc-100 shadow-sm bg-swiggy-navy text-white">
          <CardHeader className="p-6">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-swiggy-orange">
              <Clock className="w-4 h-4" /> Oldest Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
             <p className="text-3xl font-black">{queue[0]?.timeWaiting || 'N/A'}</p>
             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Target Response: 12 Hours</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl border-zinc-100 shadow-sm">
          <CardHeader className="p-6">
            <CardTitle className="text-xs font-black text-swiggy-navy uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-swiggy-orange" /> Verification Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
             <p className="text-3xl font-black text-swiggy-navy">88.5%</p>
             <p className="text-[10px] font-bold text-swiggy-gray uppercase tracking-widest mt-1">Global average for partners</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-zinc-100 shadow-sm">
          <CardHeader className="p-6">
            <CardTitle className="text-xs font-black text-swiggy-navy uppercase tracking-widest flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-swiggy-orange" /> Critical Shortage
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
             <p className="text-3xl font-black text-red-500">HSR Zone</p>
             <p className="text-[10px] font-bold text-swiggy-gray uppercase tracking-widest mt-1">Priority review for this zone</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm">
        <div className="rounded-2xl border border-zinc-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900">
              <TableRow>
                <TableHead className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest py-4">Partner Details</TableHead>
                <TableHead className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest py-4">Vehicle</TableHead>
                <TableHead className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest py-4">Submission Date</TableHead>
                <TableHead className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest py-4">Waiting</TableHead>
                <TableHead className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest py-4">Status</TableHead>
                <TableHead className="text-right text-zinc-500 font-bold uppercase text-[10px] tracking-widest py-4">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.map((rider) => (
                <TableRow key={rider.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                  <TableCell className="py-5">
                    <div className="font-black text-swiggy-navy dark:text-white uppercase tracking-tight">{rider.fullName}</div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{rider.id}</div>
                  </TableCell>
                  <TableCell className="py-5">
                    <div className="flex items-center gap-2">
                      <Bike className="w-4 h-4 text-swiggy-gray" />
                      <span className="text-sm font-bold text-swiggy-navy">{rider.vehicleType}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 text-xs font-bold text-swiggy-gray uppercase">{rider.submissionDate}</TableCell>
                  <TableCell className="py-5">
                    <Badge variant="outline" className="font-black border-zinc-200 text-swiggy-navy bg-zinc-50 rounded-lg">
                      {rider.timeWaiting}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-5">
                    <Badge className={`${rider.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-blue-100 text-blue-700 border-blue-200'} border font-black text-[9px] uppercase tracking-widest`}>
                      {rider.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-5 text-right">
                    <Link href={`/partners/${rider.id}?tab=kyc`}>
                      <Button className="bg-swiggy-orange hover:bg-swiggy-orange/90 text-white font-black px-6 rounded-xl h-10 gap-2 transition-all">
                        Review
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
