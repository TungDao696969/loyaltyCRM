"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MonitorSmartphone,
  Users,
  Award,
  Receipt,
  Store,
  Ticket,
  Megaphone,
  LayoutDashboard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const routes = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "POS Lookup", href: "/pos", icon: MonitorSmartphone },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Tiers", href: "/tiers", icon: Award },
  { name: "Transactions", href: "/transactions", icon: Receipt },
  { name: "Stores", href: "/stores", icon: Store },
  { name: "Vouchers", href: "/vouchers", icon: Ticket },
  { name: "Segments", href: "/segments", icon: Users },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone },
];

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filteredRoutes = routes.filter((route) =>
    route.name.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      {/* <div 
        onClick={() => setIsOpen(true)}
        className="flex w-full max-w-md cursor-text items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 ring-indigo-500/50 transition-all hover:bg-white hover:ring-1 shadow-sm"
      >
        <Search className="h-4 w-4 text-slate-400" />
        <span className="flex-1 text-sm text-slate-400 select-none">Search everywhere...</span>
        <div className="flex gap-1">
          <kbd className="hidden rounded border border-slate-200 bg-white px-1.5 font-sans text-xs text-slate-400 md:inline-block">⌘</kbd>
          <kbd className="hidden rounded border border-slate-200 bg-white px-1.5 font-sans text-xs text-slate-400 md:inline-block">K</kbd>
        </div>
      </div> */}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 rounded-2xl overflow-hidden border-slate-200 shadow-2xl z-[100] top-[5%] translate-y-0">
          <div className="flex items-center border-b border-slate-100 px-4 py-3">
            <Search className="h-5 w-5 text-slate-400 mr-3" />
            <Input
              autoFocus
              className="border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0 placeholder:text-slate-400 h-9"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <kbd className="hidden rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-sans text-[10px] text-slate-500 md:inline-block">
              ESC
            </kbd>
          </div>

          <div className="max-h-[300px] overflow-y-auto p-2">
            {filteredRoutes.length > 0 ? (
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-xs font-semibold text-slate-500">
                  Navigation
                </div>
                {filteredRoutes.map((route) => (
                  <button
                    key={route.href}
                    onClick={() => handleSelect(route.href)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                  >
                    <route.icon className="h-4 w-4 text-slate-400" />
                    {route.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-14 text-center text-sm text-slate-500">
                No results found for &quot;{query}&quot;
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
