'use client';

import { useReports } from '@/hooks/useReports';
import { 
  Users, 
  Award, 
  Ticket, 
  Store, 
  TrendingUp, 
  Gift, 
  Megaphone,
  CreditCard
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];

export default function DashboardPage() {
  const { report, isLoading } = useReports();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!report) {
    return <div className="text-center text-slate-500 py-12">Không có dữ liệu báo cáo</div>;
  }

  const { customers, points, campaigns, stores } = report;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-indigo-500" />
          Dashboard Khách Hàng
        </h1>
        <p className="mt-1 text-slate-500">Tổng quan về hiệu suất chương trình khách hàng thân thiết.</p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Tổng Khách Hàng</p>
              <p className="text-2xl font-bold text-slate-900">{customers.total.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-600 font-medium">{customers.active.toLocaleString()}</span>
            <span className="ml-2 text-slate-500">Đang hoạt động (Active)</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Ví Điểm (Outstanding)</p>
              <p className="text-2xl font-bold text-slate-900">{points.outstanding.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm gap-2">
            <span className="text-emerald-600 font-medium">+{points.total_earned.toLocaleString()} cấp</span>
            <span className="text-slate-300">|</span>
            <span className="text-rose-500 font-medium">-{points.total_redeemed.toLocaleString()} tiêu</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-fuchsia-50 text-fuchsia-600">
              <Megaphone className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Chiến dịch (Campaigns)</p>
              <p className="text-2xl font-bold text-slate-900">{campaigns.total}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-600 font-medium">{campaigns.sent}</span>
            <span className="ml-2 text-slate-500">Chiến dịch đã gửi</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Ticket className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Cửa hàng Tốt nhất</p>
              <p className="text-xl font-bold text-slate-900 line-clamp-1">
                {stores.top_performers.length > 0 ? stores.top_performers[0].store_name : 'N/A'}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-500">Doanh thu dẫn đầu hệ thống</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tier Distribution Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-500" /> Phân Bổ Hạng Thẻ
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customers.tier_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {customers.tier_distribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Stores Bar Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Store className="h-5 w-5 text-emerald-500" /> Top Cửa Hàng (Doanh Thu)
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stores.top_performers}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="store_name" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <RechartsTooltip cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar yAxisId="left" dataKey="total_revenue" name="Doanh Thu (VNĐ)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="transaction_count" name="Số Giao Dịch" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
