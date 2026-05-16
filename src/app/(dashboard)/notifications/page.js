"use client";

import React, { useState } from "react";
import { 
  Bell, 
  Send, 
  Smartphone, 
  Users, 
  Info,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { sendMassNotification } from "@/lib/notifications";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const [audience, setAudience] = useState("ALL");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!title || !message) {
      toast.error("Please fill in both title and message");
      return;
    }

    setLoading(true);
    try {
      const result = await sendMassNotification(audience, title, message);
      if (result.success) {
        toast.success(result.message);
        // Clear form on success
        setTitle("");
        setMessage("");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-swiggy-navy dark:text-white">
          Mass Notifications
        </h1>
        <p className="text-swiggy-gray dark:text-zinc-400">
          Broadcast push notifications to your customers and vendors instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-visible">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-swiggy-orange/10 flex items-center justify-center text-swiggy-orange">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle>Broadcast Message</CardTitle>
                  <CardDescription>Compose your notification details below.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Audience Selector */}
              <div className="space-y-2">
                <Label htmlFor="audience" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Target Audience
                </Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger id="audience" className="w-full">
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Users (Customers & Vendors)</SelectItem>
                    <SelectItem value="CUSTOMERS">Customers Only</SelectItem>
                    <SelectItem value="VENDORS">Vendors Only</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-1">
                  <Info className="w-3 h-3" />
                  Message will be sent to all active devices in this group.
                </p>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Notification Title
                </Label>
                <Input 
                  id="title"
                  placeholder="e.g., Weekend Flash Sale! 🍕"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-zinc-50/50 dark:bg-zinc-900/50"
                  maxLength={50}
                />
                <div className="flex justify-end">
                  <span className={cn(
                    "text-[10px] font-medium",
                    title.length > 40 ? "text-swiggy-orange" : "text-zinc-400"
                  )}>
                    {title.length}/50
                  </span>
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Message Content
                </Label>
                <Textarea 
                  id="message"
                  placeholder="e.g., Get 50% off on all orders above ₹499. Valid today only!"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px] bg-zinc-50/50 dark:bg-zinc-900/50"
                  maxLength={150}
                />
                <div className="flex justify-end">
                  <span className={cn(
                    "text-[10px] font-medium",
                    message.length > 130 ? "text-swiggy-orange" : "text-zinc-400"
                  )}>
                    {message.length}/150
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-500">
                <AlertCircle className="w-4 h-4" />
                <span className="text-[11px] font-medium uppercase tracking-wider">Irreversible Action</span>
              </div>
              <Button 
                onClick={handleSend}
                disabled={loading || !title || !message}
                className="bg-swiggy-orange hover:bg-swiggy-orange/90 text-white font-bold px-8 shadow-lg shadow-swiggy-orange/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Broadcast
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="flex flex-col items-center justify-start pt-4 lg:pt-10">
          <div className="relative">
            {/* Device Frame */}
            <div className="w-[280px] h-[580px] bg-zinc-900 rounded-[3rem] border-[8px] border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col">
              {/* Speaker/Camera cutout */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-zinc-800 rounded-b-2xl z-20" />
              
              {/* Screen Content (Mock Wallpaper) */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-zinc-900 to-swiggy-navy opacity-80" />
              
              {/* Status Bar */}
              <div className="relative px-6 pt-4 pb-2 flex justify-between items-center text-[10px] text-white/80 font-medium z-10">
                <span>9:41</span>
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-2 bg-white/40 rounded-[1px]" />
                  <div className="w-3 h-3 bg-white/40 rounded-full" />
                </div>
              </div>

              {/* Notification Overlay */}
              <div className="flex-1 px-4 py-10 relative z-10 flex flex-col gap-4">
                <div className="w-full h-[1px] bg-white/10 my-4" />
                
                {/* Real-time Preview Card */}
                <div className={cn(
                  "w-full bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl transition-all duration-500",
                  (title || message) ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
                )}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-swiggy-orange rounded-lg flex items-center justify-center text-white shadow-lg shadow-swiggy-orange/30">
                      <span className="text-lg font-bold italic">V</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-white uppercase tracking-wider">Vantyrn</span>
                        <span className="text-[9px] text-white/60">now</span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate max-w-[140px]">
                        {title || "Notification Title"}
                      </h4>
                    </div>
                  </div>
                  <p className="text-[11px] text-white/80 leading-relaxed line-clamp-3">
                    {message || "Compose your message to see how it will appear on your users' devices..."}
                  </p>
                </div>

                {/* Second Mock Notification (Generic) */}
                <div className="w-full bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5 opacity-40">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-zinc-700 rounded-lg" />
                    <div className="flex-1">
                      <div className="w-20 h-2 bg-white/20 rounded" />
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded mb-1" />
                  <div className="w-3/4 h-2 bg-white/10 rounded" />
                </div>
              </div>

              {/* Bottom Home Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Label for Preview */}
            <div className="mt-6 flex flex-col items-center gap-1">
              <span className="text-xs font-bold uppercase tracking-widest text-swiggy-gray dark:text-zinc-500">
                Live Device Preview
              </span>
              <span className="text-[10px] text-zinc-400">
                Visual representation of the push notification
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
