"use client";

import { 
  Users, 
  ShoppingBag, 
  Bike, 
  TrendingUp,
  Receipt,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRealtime } from "@/hooks/use-realtime";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data, loading } = useRealtime("/api/dashboard/stats", {
    interval: 1000,
    toastConfig: {
      new: (order) => `New Order Received!`,
      description: (order) => `Order #${order.id} for ₹${order.amount}`
    }
  });


  const { stats = [], recentOrders = [] } = data || {};

  const getIcon = (iconName) => {
    switch (iconName) {
      case "TrendingUp": return TrendingUp;
      case "ShoppingBag": return ShoppingBag;
      case "Receipt": return Receipt;
      case "Bike": return Bike;
      default: return TrendingUp;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
        ) : (
          stats.map((stat) => {
            const Icon = getIcon(stat.icon);
            return (
              <div key={stat.label} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow group cursor-default">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-xl transition-transform group-hover:scale-110 duration-200`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className={`${stat.color} border-current/20 font-semibold bg-transparent`}>
                    {stat.change}
                  </Badge>
                </div>
                <h3 className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-1">{stat.label}</h3>
                <p className="text-3xl font-bold text-swiggy-navy dark:text-white">{stat.value}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Hero Banner / Call to Action Section */}
      <div className="relative h-64 rounded-3xl overflow-hidden bg-swiggy-navy flex items-center px-12 group">
        <div className="z-10 relative space-y-4 max-w-xl">
          <Badge className="bg-swiggy-orange text-white hover:bg-swiggy-orange/90 border-none px-3">Live Status</Badge>
          <h2 className="text-4xl font-bold text-white leading-tight">
            Managing <span className="text-swiggy-orange italic">Vantyrn</span> operations in real-time.
          </h2>
          <p className="text-zinc-400 font-medium">
            Track orders, manage vendors, and oversee delivery logistics from your premium dashboard.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-swiggy-orange/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-swiggy-orange rounded-full blur-[100px] opacity-20 animate-pulse" />
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-swiggy-navy dark:text-white">Recent Orders</h3>
            <p className="text-sm text-swiggy-gray font-medium">Keep track of the latest food deliveries</p>
          </div>
          <button className="text-swiggy-orange font-semibold text-sm hover:underline">View All Orders</button>
        </div>

        <div className="space-y-4">
          {loading ? (
            [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)
          ) : recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center font-semibold text-swiggy-navy dark:text-white">
                    #{order.id}
                  </div>
                  <div>
                    <h4 className="font-semibold text-swiggy-navy dark:text-white">{order.customerName}</h4>
                    <div className="flex items-center gap-2 text-xs text-swiggy-gray font-medium">
                      <Clock className="w-3 h-3" /> {new Date(order.time).toLocaleTimeString()} • <Badge variant="secondary" className="text-[10px] py-0">{order.paymentMethod}</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-swiggy-navy dark:text-white">{order.amount}</p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 uppercase">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {order.status}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-zinc-500 font-medium italic">
              No recent orders found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
