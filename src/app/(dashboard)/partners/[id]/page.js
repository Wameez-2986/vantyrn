"use client";

import React, { useState, useEffect } from "react";
import { useRealtime } from "@/hooks/use-realtime";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  Bike, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  FileText, 
  AlertTriangle,
  History,
  CheckCircle2,
  XCircle,
  Ban,
  Slash,
  Eye,
  Plus,
  CreditCard,
  IdCard,
  Truck
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

export default function PartnerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const riderId = params.id;
  
  const { data: rider, loading } = useRealtime(`/api/partners/${riderId}`);
  const [activeTab, setActiveTab] = useState("overview");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isFlagDialogOpen, setIsFlagDialogOpen] = useState(false);

  const handleApproveKYC = async () => {
    try {
      const res = await fetch(`/api/partners/${riderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE_KYC" })
      });
      if (!res.ok) throw new Error("Failed to approve KYC");
      toast.success("Partner KYC Approved");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRejectKYC = async () => {
    if (!rejectReason) return toast.error("Please provide a rejection reason.");
    try {
      const res = await fetch(`/api/partners/${riderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REJECT_KYC", reason: rejectReason })
      });
      if (!res.ok) throw new Error("Failed to reject KYC");
      toast.error(`Partner KYC Rejected: ${rejectReason}`);
      setIsRejectDialogOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSuspend = async () => {
    try {
      const res = await fetch(`/api/partners/${riderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SUSPEND" })
      });
      if (!res.ok) throw new Error("Failed to suspend partner");
      toast.warning("Partner account suspended");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDisable = async () => {
    try {
      const res = await fetch(`/api/partners/${riderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DISABLE" })
      });
      if (!res.ok) throw new Error("Failed to disable partner");
      toast.error("Partner account disabled");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReactivate = async () => {
    try {
      const res = await fetch(`/api/partners/${riderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REACTIVATE" })
      });
      if (!res.ok) throw new Error("Failed to reactivate partner");
      toast.success("Partner account reactivated");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading || !rider) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-12">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-[600px] w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-xl border border-zinc-200" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-swiggy-navy dark:text-white tracking-tight">{rider.fullName}</h1>
            {(() => {
              const config = STATUS_CONFIG[rider.status] || STATUS_CONFIG.DISABLED;
              return (
                <Badge className={`${config.color} font-bold text-[10px] uppercase tracking-wider`}>
                  {config.label}
                </Badge>
              );
            })()}
          </div>
          <p className="text-sm text-swiggy-gray font-medium mt-1">Partner ID: {rider.id} • Registered on March 25, 2026</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList className="bg-white dark:bg-zinc-900 border border-zinc-100 p-1 rounded-xl h-14 shadow-sm">
            <TabsTrigger value="overview" className="rounded-lg px-6 font-bold h-full data-[state=active]:bg-swiggy-orange data-[state=active]:text-white transition-all">
              Overview
            </TabsTrigger>
            <TabsTrigger value="kyc" className="rounded-lg px-6 font-bold h-full data-[state=active]:bg-swiggy-orange data-[state=active]:text-white transition-all">
              KYC Documents
            </TabsTrigger>
            <TabsTrigger value="actions" className="rounded-lg px-6 font-bold h-full data-[state=active]:bg-swiggy-orange data-[state=active]:text-white transition-all">
              Actions & Logs
            </TabsTrigger>
          </TabsList>

          {activeTab === "kyc" && (rider.kycStatus === "KYC_SUBMITTED" || rider.kycStatus === "UNDER_REVIEW") && (
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="text-red-500 border-red-100 hover:bg-red-50 font-bold px-6 h-11"
                onClick={() => setIsRejectDialogOpen(true)}
              >
                Reject KYC
              </Button>
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 h-11"
                onClick={handleApproveKYC}
              >
                Approve KYC
              </Button>
            </div>
          )}
        </div>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-left-4 duration-500">
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-3xl border-zinc-100 shadow-sm overflow-hidden">
               <CardHeader className="p-8 border-b border-zinc-50 flex flex-row items-center gap-6">
                  <Avatar className="w-24 h-24 rounded-2xl border-2 border-zinc-100">
                    <AvatarImage src={rider.profilePhoto} />
                    <AvatarFallback className="bg-zinc-100 text-swiggy-navy text-2xl font-black">{rider.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-black text-swiggy-navy uppercase tracking-tight">{rider.fullName}</CardTitle>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${rider.isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                      <span className="text-xs font-black uppercase tracking-widest text-swiggy-gray">{rider.isOnline ? 'Active Now' : 'Offline'}</span>
                    </div>
                  </div>
               </CardHeader>
               <CardContent className="p-8">
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center border border-zinc-100">
                            <Phone className="w-4 h-4 text-swiggy-orange" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-swiggy-gray">Phone</p>
                            <p className="text-sm font-bold text-swiggy-navy">{rider.phone}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center border border-zinc-100">
                            <Mail className="w-4 h-4 text-swiggy-orange" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-swiggy-gray">Email</p>
                            <p className="text-sm font-bold text-swiggy-navy">{rider.email}</p>
                          </div>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center border border-zinc-100">
                            <MapPin className="w-4 h-4 text-swiggy-orange" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-swiggy-gray">Preferred Zone</p>
                            <p className="text-sm font-bold text-swiggy-navy">{rider.preferredZone}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center border border-zinc-100">
                            <ShieldCheck className="w-4 h-4 text-swiggy-orange" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-swiggy-gray">KYC Status</p>
                            <Badge variant="outline" className="mt-1 font-bold text-emerald-600 border-emerald-100 bg-emerald-50">{rider.kycStatus}</Badge>
                          </div>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="rounded-3xl border-zinc-100 shadow-sm overflow-hidden">
               <CardHeader className="p-8 border-b border-zinc-50 bg-zinc-50/50">
                  <CardTitle className="text-lg font-black text-swiggy-navy inline-flex items-center gap-2 uppercase tracking-tight">
                    <Bike className="w-5 h-5 text-swiggy-orange" /> Vehicle Information
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex gap-3 text-left">
                       <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                         <Truck className="w-4 h-4 text-swiggy-gray" />
                       </div>
                       <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-swiggy-gray">Vehicle Type</p>
                         <p className="text-lg font-black text-swiggy-navy">{rider.vehicleType}</p>
                       </div>
                    </div>
                    <div className="flex gap-3 text-left">
                       <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                         <span className="text-[10px] font-black text-zinc-400">PLATE</span>
                       </div>
                       <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-swiggy-gray">Vehicle Number</p>
                         <p className="text-lg font-black text-swiggy-navy tracking-widest">{rider.vehicleNumber}</p>
                       </div>
                    </div>
                  </div>
               </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl border-zinc-100 shadow-sm overflow-hidden h-fit">
               <CardHeader className="p-8 border-b border-zinc-50 bg-red-900">
                 <div className="flex items-center justify-between">
                   <CardTitle className="text-lg font-black text-white inline-flex items-center gap-2">
                     <AlertTriangle className="w-5 h-5 text-swiggy-orange" /> Compliance
                   </CardTitle>
                   <Button size="sm" className="h-8 bg-swiggy-orange hover:bg-swiggy-orange/90 text-white font-bold rounded-lg border-none">
                     Add Flag
                   </Button>
                 </div>
               </CardHeader>
               <CardContent className="p-6 space-y-4">
                 {rider.complianceFlags.map((flag, i) => (
                   <div key={i} className="p-4 rounded-2xl bg-red-50 border border-red-100 relative group animate-in slide-in-from-top-2">
                     <Badge className="bg-red-500 text-white mb-2 font-bold text-[9px] uppercase tracking-widest">
                       {flag.type}
                     </Badge>
                     <p className="text-xs font-bold text-red-900 leading-relaxed mb-2">
                       {flag.description}
                     </p>
                     <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest inline-flex items-center gap-1">
                       <Clock className="w-2.5 h-2.5" /> Flagged on {flag.date}
                     </p>
                   </div>
                 ))}
               </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* KYC Tab Content */}
        <TabsContent value="kyc" className="animate-in slide-in-from-right-4 duration-500">
          <Card className="rounded-3xl border-zinc-100 shadow-sm overflow-hidden">
             <CardHeader className="p-8 border-b border-zinc-50">
                <CardTitle className="text-lg font-black text-swiggy-navy inline-flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-swiggy-orange" /> Verification Documents
                </CardTitle>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-zinc-50">
                  {rider.kycDocuments.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-8 hover:bg-zinc-50/50 transition-colors">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                            {doc.type.includes('ID') && <IdCard className="w-7 h-7 text-swiggy-orange" />}
                            {doc.type.includes('License') && <CreditCard className="w-7 h-7 text-swiggy-orange" />}
                            {doc.type.includes('Vehicle') && <Truck className="w-7 h-7 text-swiggy-orange" />}
                          </div>
                          <div>
                            <h4 className="font-black text-swiggy-navy uppercase text-sm tracking-tight">{doc.type}</h4>
                            <p className="text-xs font-medium text-swiggy-gray mt-1 flex items-center gap-2 uppercase tracking-widest">
                               Submitted: {doc.date}
                            </p>
                          </div>
                       </div>
                       <Button variant="outline" className="rounded-xl font-bold h-11 gap-2 border-zinc-200">
                         <Eye className="w-4 h-4" /> View Document
                       </Button>
                    </div>
                  ))}
                </div>
             </CardContent>
          </Card>

          <Card className="rounded-3xl border-zinc-100 shadow-sm overflow-hidden mt-6">
             <CardHeader className="p-8 border-b border-zinc-50">
                <CardTitle className="text-lg font-black text-swiggy-navy inline-flex items-center gap-2">
                  <History className="w-5 h-5 text-swiggy-orange" /> KYC Review History
                </CardTitle>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-zinc-50">
                  {rider.kycReviews && rider.kycReviews.length > 0 ? rider.kycReviews.map((review, i) => (
                    <div key={i} className="p-6 flex items-start gap-4 hover:bg-zinc-50/50">
                       <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${review.decision === 'approved' ? 'bg-green-100' : 'bg-red-100'}`}>
                         {review.decision === 'approved' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                       </div>
                       <div>
                         <p className="text-sm font-bold text-swiggy-navy tracking-tight uppercase">DECISION: {review.decision}</p>
                         {review.reason && <p className="text-xs font-bold text-red-500 mt-1">Reason: {review.reason}</p>}
                         <p className="text-xs font-medium text-swiggy-gray mt-1 flex items-center gap-2">
                           Reviewed by: {review.by} <span className="w-1 h-1 rounded-full bg-zinc-200" /> {review.date}
                         </p>
                       </div>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-zinc-400 font-medium text-sm">No review history found.</div>
                  )}
                </div>
             </CardContent>
          </Card>
        </TabsContent>

        {/* Actions Tab Content */}
        <TabsContent value="actions" className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
           <Card className="rounded-3xl border-zinc-100 shadow-sm h-fit">
              <CardHeader className="p-8 border-b border-zinc-50">
                <CardTitle className="text-lg font-black text-swiggy-navy inline-flex items-center gap-2">
                  <Slash className="w-5 h-5 text-swiggy-orange" /> Account Controls
                </CardTitle>
             </CardHeader>
             <CardContent className="p-8 space-y-4">
                {rider.status === 'ACTIVE' && (
                    <Button 
                    className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest rounded-2xl gap-3 shadow-lg shadow-orange-100"
                    onClick={handleSuspend}
                  >
                    <Ban className="w-5 h-5" /> Suspend Partner
                  </Button>
                )}
                {(rider.status === 'ACTIVE' || rider.status === 'SUSPENDED') && (
                  <Button 
                    variant="outline"
                    className="w-full h-14 border-red-200 text-red-500 hover:bg-red-50 font-black uppercase tracking-widest rounded-2xl gap-3"
                    onClick={handleDisable}
                  >
                    <XCircle className="w-5 h-5" /> Disable Permanently
                  </Button>
                )}
                {rider.status === 'SUSPENDED' && (
                  <Button 
                    className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-black uppercase tracking-widest rounded-2xl gap-3 shadow-lg shadow-green-100"
                    onClick={handleReactivate}
                  >
                    <CheckCircle2 className="w-5 h-5" /> Restore Access
                  </Button>
                )}
             </CardContent>
           </Card>

           <Card className="rounded-3xl border-zinc-100 shadow-sm overflow-hidden">
             <CardHeader className="p-8 border-b border-zinc-50">
                <CardTitle className="text-lg font-black text-swiggy-navy inline-flex items-center gap-2">
                  <History className="w-5 h-5 text-swiggy-orange" /> Action Log
                </CardTitle>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-zinc-50">
                  {rider.adminActions && rider.adminActions.length > 0 ? rider.adminActions.map((log, i) => (
                    <div key={i} className="p-6 flex items-start gap-4 hover:bg-zinc-50/20">
                       <div className="w-8 h-8 rounded-lg bg-zinc-100 flex-shrink-0 flex items-center justify-center">
                         <ShieldCheck className="w-4 h-4 text-zinc-400" />
                       </div>
                       <div>
                         <p className="text-sm font-bold text-swiggy-navy tracking-tight">{log.action}</p>
                         <p className="text-xs font-medium text-swiggy-gray mt-1">
                           <span className="font-bold text-zinc-600">{log.oldStatus || "N/A"}</span> ➔ <span className="font-bold text-zinc-900">{log.action.replace("STATUS_CHANGED_", "")}</span>
                         </p>
                         {log.reason && <p className="text-xs text-red-500 mt-1 italic">Reason: {log.reason}</p>}
                         <p className="text-xs font-medium text-zinc-400 mt-2 flex items-center gap-2">
                           Changed by: {log.by} <span className="w-1 h-1 rounded-full bg-zinc-200" /> {log.date}
                         </p>
                       </div>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-zinc-400 font-medium text-sm">No status logs found.</div>
                  )}
                </div>
             </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Rejection Reason Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-swiggy-navy">KYC Rejection Reason</DialogTitle>
            <DialogDescription className="font-medium">
              Explain why documentation was rejected.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="e.g. License photo is blurry." 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[120px] rounded-xl"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" className="font-bold" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
            <Button className="bg-red-500 hover:bg-red-600 font-bold px-6" onClick={handleRejectKYC}>Submit Rejection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
