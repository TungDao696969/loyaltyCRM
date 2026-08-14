'use client';

import { useAuthStore } from '@/store/authStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Store, LogOut, LayoutDashboard, Flower, Bell, Search, Settings, Users, MonitorSmartphone, Ticket, Award, Receipt, Megaphone, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { GlobalSearch } from '@/components/GlobalSearch';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !token) {
      router.push('/login');
    }
  }, [isClient, token, router]);

  if (!isClient || !token) {
    return <div className="flex h-screen items-center justify-center bg-white text-slate-500">Loading...</div>;
  }

  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'POS Lookup', href: '/pos', icon: MonitorSmartphone },
    { name: 'Orders', href: '/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Tiers', href: '/tiers', icon: Award },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
    { name: 'Stores', href: '/stores', icon: Store },
    { name: 'Vouchers', href: '/vouchers', icon: Ticket },
    { name: 'Segments', href: '/segments', icon: Users },
    { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
  ];

  return (
    <div className="flex min-h-screen w-full bg-white text-slate-900 selection:bg-indigo-500/30">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-slate-50 transition-all duration-300 ease-in-out">
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-yellow-400 to-amber-500 shadow-md shadow-yellow-500/20">
            <Flower className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Hoa Mai <span className="text-amber-500">Mart</span></span>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <div className="mb-4 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Menu</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <item.icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {item.name}
                {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]" />}
              </Link>
            );
          })}
        </nav>


      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-xl">
          <GlobalSearch />
          <div className="flex items-center gap-6 ml-auto">
            <button className="relative rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            
            {/* Admin Avatar & Logout */}
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 ring-1 ring-slate-200">
                  <span className="text-sm font-semibold text-indigo-700">{user?.username?.charAt(0).toUpperCase()}</span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-slate-900">{user?.fullName || user?.username}</div>
                  <div className="text-xs text-slate-500">{user?.role}</div>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8 bg-white">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
