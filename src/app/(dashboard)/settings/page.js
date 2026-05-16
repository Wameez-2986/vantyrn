"use client";

import React, { useState, useEffect } from "react";
import { 
  Settings, 
  Clock, 
  ShieldCheck, 
  Save, 
  RefreshCcw,
  AlertTriangle,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  const [configs, setConfigs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/config");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data = await res.json();
      
      const configMap = {};
      data.forEach(cfg => {
        configMap[cfg.configKey] = cfg.configValue;
      });
      setConfigs(configMap);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleUpdate = (key, value) => {
    setConfigs(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const configArray = Object.keys(configs).map(key => ({
        key,
        value: String(configs[key])
      }));

      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ configs: configArray })
      });

      if (!res.ok) throw new Error("Failed to save settings");
      toast.success("Platform settings updated successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] rounded-3xl" />
          <Skeleton className="h-[400px] rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-swiggy-navy dark:text-white tracking-tight uppercase italic">Global Settings</h1>
          <p className="text-xs sm:text-sm text-swiggy-gray font-bold uppercase tracking-widest mt-1">Configure platform-wide rules and thresholds</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={fetchConfigs}
            className="rounded-xl border-zinc-200 h-10 sm:h-12 px-4 gap-2 font-bold"
          >
            <RefreshCcw className="w-4 h-4" />
            Reload
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-swiggy-orange hover:bg-swiggy-orange/90 text-white font-black px-8 h-10 sm:h-12 rounded-xl shadow-lg shadow-swiggy-orange/20 gap-2 uppercase tracking-widest"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save All Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SLA Thresholds */}
        <Card className="rounded-[2rem] border-zinc-100 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
          <CardHeader className="p-8 border-b border-zinc-50 bg-swiggy-navy relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-swiggy-orange/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
             <CardTitle className="text-xl font-black text-white inline-flex items-center gap-3 relative z-10">
               <div className="w-10 h-10 bg-swiggy-orange/20 rounded-xl flex items-center justify-center border border-swiggy-orange/30">
                 <Clock className="w-5 h-5 text-swiggy-orange" />
               </div>
               SLA Breach Thresholds
             </CardTitle>
             <CardDescription className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mt-2">
               Maximum allowed time for each order phase
             </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-swiggy-gray ml-1">Max Food Prep Time (Mins)</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={configs.SLA_FOOD_PREP_MAX_MINS || "20"} 
                    onChange={(e) => handleUpdate('SLA_FOOD_PREP_MAX_MINS', e.target.value)}
                    className="h-14 rounded-2xl border-2 border-zinc-100 bg-zinc-50/50 px-6 font-black text-lg text-swiggy-navy focus:border-swiggy-orange focus:bg-white outline-none transition-all" 
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-swiggy-gray font-bold text-xs uppercase">Minutes</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-swiggy-gray ml-1">Max Rider Pickup Time (Mins)</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={configs.SLA_PICKUP_MAX_MINS || "10"} 
                    onChange={(e) => handleUpdate('SLA_PICKUP_MAX_MINS', e.target.value)}
                    className="h-14 rounded-2xl border-2 border-zinc-100 bg-zinc-50/50 px-6 font-black text-lg text-swiggy-navy focus:border-swiggy-orange focus:bg-white outline-none transition-all" 
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-swiggy-gray font-bold text-xs uppercase">Minutes</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-swiggy-gray ml-1">Max Last-Mile Delivery Time (Mins)</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={configs.SLA_DELIVERY_MAX_MINS || "15"} 
                    onChange={(e) => handleUpdate('SLA_DELIVERY_MAX_MINS', e.target.value)}
                    className="h-14 rounded-2xl border-2 border-zinc-100 bg-zinc-50/50 px-6 font-black text-lg text-swiggy-navy focus:border-swiggy-orange focus:bg-white outline-none transition-all" 
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-swiggy-gray font-bold text-xs uppercase">Minutes</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] font-bold text-amber-900 leading-relaxed uppercase">
                Changing these values will immediately affect real-time SLA monitoring and compliance flagging for all active orders.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security & Access */}
        <Card className="rounded-[2rem] border-zinc-100 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 opacity-80">
          <CardHeader className="p-8 border-b border-zinc-50 bg-zinc-900 relative overflow-hidden">
             <CardTitle className="text-xl font-black text-white inline-flex items-center gap-3 relative z-10">
               <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                 <ShieldCheck className="w-5 h-5 text-emerald-500" />
               </div>
               Platform Compliance
             </CardTitle>
             <CardDescription className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mt-2">
               Global safety and verification rules
             </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 hover:bg-zinc-50 transition-all">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-black text-swiggy-navy uppercase">Age Verification (ID)</span>
                  <p className="text-[10px] font-bold text-swiggy-gray uppercase tracking-tighter">Required for Tobacco & Alcohol</p>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black">ENABLED</Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 hover:bg-zinc-50 transition-all">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-black text-swiggy-navy uppercase">Auto-Suspend Vendor</span>
                  <p className="text-[10px] font-bold text-swiggy-gray uppercase tracking-tighter">After 3 consecutive SLA breaches</p>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black">ENABLED</Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 hover:bg-zinc-50 transition-all">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-black text-swiggy-navy uppercase">Customer Flagging</span>
                  <p className="text-[10px] font-bold text-swiggy-gray uppercase tracking-tighter">Enable administrative blocks</p>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black">ENABLED</Badge>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[11px] font-bold text-blue-900 leading-relaxed uppercase">
                These compliance modules are core to the platform integrity. Contact technical support to modify underlying logic.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
