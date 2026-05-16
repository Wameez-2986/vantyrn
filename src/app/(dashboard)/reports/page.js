"use client";

import React, { useState, useEffect } from "react";
import { useRealtime } from "@/hooks/use-realtime";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Legend,
  Cell
} from "recharts";
import { 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  Store, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ShieldCheck,
  Bike
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock Data removed

export default function ReportsPage() {
  const { data, loading } = useRealtime("/api/reports", { interval: 5000 }); // 5s for reports is enough
  const [activeTab, setActiveTab] = useState("orders");

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-12">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-[600px] w-full rounded-3xl" />
      </div>
    );
  }

  const { orderTrend, revenueTrend, vendorPerformance, partnerPerformance } = data;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-swiggy-navy dark:text-white tracking-tight">Analytics & Reports</h1>
          <p className="text-sm text-swiggy-gray font-medium mt-1">Deep dive into business performance and operational efficiency</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl font-bold h-12 gap-2 border-zinc-200 shadow-sm">
             <Calendar className="w-4 h-4 text-swiggy-orange" />
             Last 7 Days
           </Button>
           <Button className="bg-swiggy-navy hover:bg-swiggy-navy/90 text-white font-black px-6 rounded-xl h-12 shadow-lg">
             Export Data
           </Button>
        </div>
      </div>

      <Tabs defaultValue="orders" className="space-y-6" onValueChange={setActiveTab}>
        <div className="flex items-center justify-center lg:justify-start">
          <TabsList className="bg-white dark:bg-zinc-900 border border-zinc-100 p-1 rounded-2xl h-14 shadow-sm inline-flex">
            <TabsTrigger value="orders" className="rounded-xl px-8 font-black text-xs uppercase tracking-widest h-full data-[state=active]:bg-swiggy-orange data-[state=active]:text-white transition-all">
              Orders
            </TabsTrigger>
            <TabsTrigger value="revenue" className="rounded-xl px-8 font-black text-xs uppercase tracking-widest h-full data-[state=active]:bg-swiggy-orange data-[state=active]:text-white transition-all">
              Revenue
            </TabsTrigger>
            <TabsTrigger value="vendors" className="rounded-xl px-8 font-black text-xs uppercase tracking-widest h-full data-[state=active]:bg-swiggy-orange data-[state=active]:text-white transition-all">
              Vendors
            </TabsTrigger>
            <TabsTrigger value="partners" className="rounded-xl px-8 font-black text-xs uppercase tracking-widest h-full data-[state=active]:bg-swiggy-orange data-[state=active]:text-white transition-all">
              Partners
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Orders Report Tab */}
        <TabsContent value="orders" className="space-y-6 animate-in slide-in-from-left-4 duration-500">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Orders", value: data.summary.orders.total, change: "+0%", positive: true, icon: ShoppingBag },
                { label: "Completed", value: data.summary.orders.completed, change: "+0%", positive: true, icon: CheckCircle2 },
                { label: "Cancelled", value: data.summary.orders.cancelled, change: "-0%", positive: false, icon: XCircle },
                { label: "Avg Order Value", value: data.summary.orders.avgValue, change: "+0%", positive: true, icon: TrendingUp },
              ].map((stat, i) => (
                <Card key={i} className="rounded-3xl border-zinc-100 shadow-sm overflow-hidden">
                   <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                          <stat.icon className="w-5 h-5 text-swiggy-orange" />
                        </div>
                        <Badge className={`${stat.positive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} font-black text-[10px] border-none`}>
                          {stat.change}
                        </Badge>
                      </div>
                      <p className="text-2xl font-black text-swiggy-navy">{stat.value}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-swiggy-gray mt-1">{stat.label}</p>
                   </CardContent>
                </Card>
              ))}
           </div>

           <Card className="rounded-3xl border-zinc-100 shadow-sm overflow-hidden">
              <CardHeader className="p-8 border-b border-zinc-50 flex flex-row items-center justify-between">
                 <div>
                    <CardTitle className="text-xl font-black text-swiggy-navy uppercase tracking-tight">Daily Orders Trend</CardTitle>
                    <CardDescription className="text-swiggy-gray font-bold">Orders per day in the selected range</CardDescription>
                 </div>
              </CardHeader>
              <CardContent className="p-8">
                 <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={orderTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                          <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 900, fill: '#686b78' }} 
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 900, fill: '#686b78' }} 
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                            itemStyle={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '10px' }}
                            labelStyle={{ fontWeight: 900, marginBottom: '4px', textTransform: 'uppercase', fontSize: '12px' }}
                          />
                          <Bar dataKey="orders" fill="#fc8019" radius={[10, 10, 0, 0]} />
                          <Bar dataKey="completed" fill="#2eb364" radius={[10, 10, 0, 0]} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </CardContent>
           </Card>

           <Card className="rounded-3xl border-zinc-100 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                 <Table>
                    <TableHeader className="bg-zinc-50">
                       <TableRow>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest p-6">Date</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest p-6">Total Orders</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest p-6">Completed</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest p-6">Cancelled</TableHead>
                          <TableHead className="font-right font-black uppercase text-[10px] tracking-widest p-6 text-right">Revenue</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {orderTrend.map((row) => (
                          <TableRow key={row.date} className="hover:bg-zinc-50/50 transition-colors">
                             <TableCell className="p-6 font-bold text-swiggy-navy">{row.date}</TableCell>
                             <TableCell className="p-6 font-black text-swiggy-navy">{row.orders}</TableCell>
                             <TableCell className="p-6 font-bold text-emerald-600">{row.completed}</TableCell>
                             <TableCell className="p-6 font-bold text-red-500">{row.cancelled}</TableCell>
                             <TableCell className="p-6 font-black text-swiggy-navy text-right">₹{row.revenue.toLocaleString()}</TableCell>
                          </TableRow>
                       ))}
                    </TableBody>
                 </Table>
              </CardContent>
           </Card>
        </TabsContent>

        {/* Revenue Report Tab */}
        <TabsContent value="revenue" className="space-y-6 animate-in slide-in-from-right-4 duration-500">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Gross Revenue", value: data.summary.revenue.gross, change: "+0%", icon: TrendingUp },
                { label: "Commission", value: data.summary.revenue.commission, change: "+0%", icon: Receipt },
                { label: "Net Payout", value: data.summary.revenue.net, change: "+0%", icon: Store },
              ].map((stat, i) => (
                <Card key={i} className="rounded-3xl border-zinc-100 shadow-sm overflow-hidden">
                   <CardContent className="p-8">
                      <div className="w-12 h-12 rounded-xl bg-swiggy-orange/10 border border-swiggy-orange/10 flex items-center justify-center mb-4">
                        <stat.icon className="w-6 h-6 text-swiggy-orange" />
                      </div>
                      <p className="text-3xl font-black text-swiggy-navy">{stat.value}</p>
                      <p className="text-[12px] font-black uppercase tracking-widest text-swiggy-gray mt-1">{stat.label}</p>
                   </CardContent>
                </Card>
              ))}
           </div>

           <Card className="rounded-3xl border-zinc-100 shadow-sm overflow-hidden">
              <CardHeader className="p-8 border-b border-zinc-50">
                 <CardTitle className="text-xl font-black text-swiggy-navy uppercase tracking-tight">Revenue Trend</CardTitle>
                 <CardDescription className="text-swiggy-gray font-bold">Gross revenue over the past week</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                 <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={revenueTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                          <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 900, fill: '#686b78' }} 
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 900, fill: '#686b78' }} 
                            tickFormatter={(v) => `₹${v/1000}k`}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                            itemStyle={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '10px' }}
                            labelStyle={{ fontWeight: 900, marginBottom: '4px', textTransform: 'uppercase', fontSize: '12px' }}
                            formatter={(v) => `₹${v.toLocaleString()}`}
                          />
                          <Line type="monotone" dataKey="gross" stroke="#fc8019" strokeWidth={4} dot={{ r: 6, fill: '#fc8019', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="net" stroke="#2eb364" strokeWidth={4} dot={{ r: 6, fill: '#2eb364', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                       </LineChart>
                    </ResponsiveContainer>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

        {/* Vendor Performance Tab */}
        <TabsContent value="vendors" className="animate-in slide-in-from-bottom-4 duration-500">
           <Card className="rounded-3xl border-zinc-100 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                 <Table>
                    <TableHeader className="bg-zinc-50">
                       <TableRow>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest p-6">Vendor Name</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest p-6">Orders</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest p-6">Acceptance Rate</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest p-6">SLA Breaches</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest p-6">Avg Rating</TableHead>
                          <TableHead className="font-right font-black uppercase text-[10px] tracking-widest p-6 text-right">Revenue</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {vendorPerformance.map((v) => (
                          <TableRow key={v.id} className="hover:bg-zinc-50/50 transition-colors">
                             <TableCell className="p-6">
                                <Link href={`/vendors/${v.id}`} className="font-black text-swiggy-navy hover:text-swiggy-orange transition-colors">
                                  {v.name}
                                </Link>
                             </TableCell>
                             <TableCell className="p-6 font-bold">{v.orders}</TableCell>
                             <TableCell className="p-6">
                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px]">{v.acceptance}</Badge>
                             </TableCell>
                             <TableCell className="p-6 font-bold text-red-500">{v.sla}</TableCell>
                             <TableCell className="p-6">
                                <div className="flex items-center gap-1 font-black text-swiggy-navy">
                                   <Star className="w-3 h-3 fill-swiggy-orange text-swiggy-orange" />
                                   {v.rating}
                                </div>
                             </TableCell>
                             <TableCell className="p-6 font-black text-swiggy-navy text-right">{v.revenue}</TableCell>
                          </TableRow>
                       ))}
                    </TableBody>
                 </Table>
              </CardContent>
           </Card>
        </TabsContent>

        {/* Partner Performance Tab */}
        <TabsContent value="partners" className="animate-in slide-in-from-bottom-4 duration-500">
           <Card className="rounded-3xl border-zinc-100 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                 <Table>
                    <TableHeader className="bg-zinc-50">
                       <TableRow>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest p-6">Partner Name</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest p-6">Deliveries</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest p-6">On-Time Rate</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest p-6">Avg Time</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest p-6">Flags</TableHead>
                          <TableHead className="font-right font-black uppercase text-[10px] tracking-widest p-6 text-right">Actions</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {partnerPerformance.map((p) => (
                          <TableRow key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                             <TableCell className="p-6">
                                <Link href={`/partners/${p.id}`} className="font-black text-swiggy-navy hover:text-swiggy-orange transition-colors">
                                  {p.name}
                                </Link>
                             </TableCell>
                             <TableCell className="p-6 font-bold">{p.completed}</TableCell>
                             <TableCell className="p-6">
                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px]">{p.onTime}</Badge>
                             </TableCell>
                             <TableCell className="p-6 font-bold flex items-center gap-1">
                                <Clock className="w-4 h-4 text-swiggy-gray" />
                                {p.avgTime}
                             </TableCell>
                             <TableCell className="p-6">
                                <Badge className={`${p.flags > 2 ? 'bg-red-50 text-red-500' : 'bg-zinc-50 text-zinc-400'} border-none font-black text-[10px]`}>
                                  {p.flags} Flags
                                </Badge>
                             </TableCell>
                             <TableCell className="p-6 text-right">
                                <Link href={`/partners/${p.id}`}>
                                  <Button variant="ghost" size="sm" className="font-bold text-swiggy-orange hover:bg-swiggy-orange/10 rounded-lg">
                                    View Detail
                                  </Button>
                                </Link>
                             </TableCell>
                          </TableRow>
                       ))}
                    </TableBody>
                 </Table>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Missing icons for the stats cards
function CheckCircle2(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function XCircle(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  )
}

function Receipt(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 17.5V6.5" />
    </svg>
  )
}

function Star(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
