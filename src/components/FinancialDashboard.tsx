import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Layers,
  Calendar,
  ArrowUpRight,
  Sparkles,
  Clock,
  CheckCircle2,
  BarChart3,
  PieChart as PieIcon,
  Filter,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { CommissionOrder, Currency } from '../types';
import { exportCommissionsToCSV, exportMonthlyReportToCSV } from '../utils/csvExport';

interface FinancialDashboardProps {
  commissions: CommissionOrder[];
  currency: Currency;
  onOpenPricing?: () => void;
}

interface MonthlyDataPoint {
  monthKey: string;
  monthLabel: string;
  commissions: number;
  marketing: number;
  prints: number;
  tech: number;
  total: number;
  cumulative: number;
  orderCount: number;
}

const CATEGORY_CONFIG: Record<
  string,
  { label: string; color: string; bgClass: string; textClass: string }
> = {
  commissions: {
    label: 'Custom Portraits & Art',
    color: '#F59E0B', // Amber
    bgClass: 'bg-amber-400',
    textClass: 'text-amber-400',
  },
  marketing: {
    label: 'Celebration & Marketing Posters',
    color: '#10B981', // Emerald
    bgClass: 'bg-emerald-400',
    textClass: 'text-emerald-400',
  },
  prints: {
    label: 'Digital Prints & Wallpapers',
    color: '#06B6D4', // Cyan
    bgClass: 'bg-cyan-400',
    textClass: 'text-cyan-400',
  },
  tech: {
    label: 'Tech Branding & BIT Identity',
    color: '#8B5CF6', // Violet
    bgClass: 'bg-violet-400',
    textClass: 'text-violet-400',
  },
};

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  commissions,
  currency,
  onOpenPricing,
}) => {
  const [chartType, setChartType] = useState<'area' | 'bar' | 'cumulative'>('area');
  const [revenueBasis, setRevenueBasis] = useState<'realized' | 'booked'>('realized');
  const [timeFilter, setTimeFilter] = useState<'all' | 'recent'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleExportFullCSV = () => {
    const res = exportCommissionsToCSV(commissions, currency);
    if (res.success) {
      setToastMessage(`Exported ${res.rowCount} orders to ${res.fileName}`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleExportMonthlyCSV = () => {
    const res = exportMonthlyReportToCSV(commissions, currency);
    if (res.success) {
      setToastMessage(`Monthly report exported to ${res.fileName}`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const currencySymbol = currency === 'KSH' ? 'KSh ' : '$';

  // Helper to extract effective revenue for a commission given the basis
  const getCommissionRevenue = (order: CommissionOrder, basis: 'realized' | 'booked') => {
    const rawPrice = currency === 'KSH' ? order.priceKSh : order.priceUSD;
    if (basis === 'booked') {
      return rawPrice;
    }
    // Realized cash collected
    if (order.depositStatus === 'fully_paid') {
      return rawPrice;
    }
    if (order.depositStatus === 'deposit_paid') {
      return Math.round(rawPrice * 0.5);
    }
    return 0; // unpaid inquiry
  };

  // Process data chronologically
  const { monthlyData, categoryBreakdown, totals } = useMemo(() => {
    // 1. Group orders by Month YYYY-MM
    const monthGroups: Record<string, CommissionOrder[]> = {};

    // Standard sequence of months to ensure smooth axis
    const defaultMonths = ['2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10'];
    defaultMonths.forEach((m) => {
      monthGroups[m] = [];
    });

    commissions.forEach((order) => {
      const dateStr = order.createdAt || order.deadline || '2026-09-15';
      const monthKey = dateStr.slice(0, 7); // 'YYYY-MM'
      if (!monthGroups[monthKey]) {
        monthGroups[monthKey] = [];
      }
      monthGroups[monthKey].push(order);
    });

    const sortedMonthKeys = Object.keys(monthGroups).sort();
    const finalMonthKeys = timeFilter === 'recent' ? sortedMonthKeys.slice(-4) : sortedMonthKeys;

    let runningCumulative = 0;
    const monthlyDataList: MonthlyDataPoint[] = [];

    // Category accumulator
    const catTotals: Record<string, { revenue: number; count: number }> = {
      commissions: { revenue: 0, count: 0 },
      marketing: { revenue: 0, count: 0 },
      prints: { revenue: 0, count: 0 },
      tech: { revenue: 0, count: 0 },
    };

    finalMonthKeys.forEach((mKey) => {
      const ordersInMonth = monthGroups[mKey] || [];
      const [year, month] = mKey.split('-');
      const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      const monthLabel = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      });

      let monthCommissions = 0;
      let monthMarketing = 0;
      let monthPrints = 0;
      let monthTech = 0;

      ordersInMonth.forEach((order) => {
        const rev = getCommissionRevenue(order, revenueBasis);
        const cat = order.category in catTotals ? order.category : 'commissions';

        if (cat === 'commissions') monthCommissions += rev;
        else if (cat === 'marketing') monthMarketing += rev;
        else if (cat === 'prints') monthPrints += rev;
        else if (cat === 'tech') monthTech += rev;

        catTotals[cat].revenue += rev;
        catTotals[cat].count += 1;
      });

      const monthTotal = monthCommissions + monthMarketing + monthPrints + monthTech;
      runningCumulative += monthTotal;

      monthlyDataList.push({
        monthKey: mKey,
        monthLabel,
        commissions: monthCommissions,
        marketing: monthMarketing,
        prints: monthPrints,
        tech: monthTech,
        total: monthTotal,
        cumulative: runningCumulative,
        orderCount: ordersInMonth.length,
      });
    });

    // Calculate Overall KPIs
    let totalRealized = 0;
    let totalBooked = 0;
    let totalPendingReceivables = 0;

    commissions.forEach((order) => {
      const rawPrice = currency === 'KSH' ? order.priceKSh : order.priceUSD;
      totalBooked += rawPrice;

      if (order.depositStatus === 'fully_paid') {
        totalRealized += rawPrice;
      } else if (order.depositStatus === 'deposit_paid') {
        const deposit = Math.round(rawPrice * 0.5);
        totalRealized += deposit;
        totalPendingReceivables += rawPrice - deposit;
      } else {
        totalPendingReceivables += rawPrice;
      }
    });

    const totalOrdersCount = commissions.length;
    const aov = totalOrdersCount > 0 ? Math.round(totalBooked / totalOrdersCount) : 0;

    // Pie chart array
    const pieData = Object.entries(catTotals).map(([key, data]) => ({
      key,
      name: CATEGORY_CONFIG[key]?.label || key,
      value: data.revenue,
      count: data.count,
      color: CATEGORY_CONFIG[key]?.color || '#E4E4E7',
    }));

    // Find top performing category
    const topCategory = [...pieData].sort((a, b) => b.value - a.value)[0] || pieData[0];

    return {
      monthlyData: monthlyDataList,
      categoryBreakdown: pieData,
      totals: {
        totalRealized,
        totalBooked,
        totalPendingReceivables,
        aov,
        totalOrdersCount,
        topCategory,
      },
    };
  }, [commissions, currency, revenueBasis, timeFilter]);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const monthItem = monthlyData.find((d) => d.monthLabel === label);
      const totalAmount =
        chartType === 'cumulative'
          ? payload[0]?.value || 0
          : payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0);

      return (
        <div className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-xl shadow-2xl text-xs space-y-2 min-w-[210px] pointer-events-none">
          <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
            <span className="font-bold text-white text-sm font-display">{label}</span>
            <span className="text-[11px] font-mono text-zinc-400">
              {monthItem?.orderCount || 0} orders
            </span>
          </div>

          <div className="space-y-1">
            {chartType === 'cumulative' ? (
              <div className="flex items-center justify-between gap-3 text-emerald-400">
                <span>Cumulative Studio Revenue:</span>
                <span className="font-mono font-bold">
                  {currencySymbol}
                  {totalAmount.toLocaleString()}
                </span>
              </div>
            ) : (
              payload.map((entry: any, index: number) => {
                const config = CATEGORY_CONFIG[entry.dataKey] || {
                  label: entry.name,
                  color: entry.color,
                };
                if (!entry.value) return null;
                return (
                  <div key={index} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-sm shrink-0"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-zinc-300 truncate max-w-[130px]">{config.label}</span>
                    </div>
                    <span className="font-mono font-semibold text-white">
                      {currencySymbol}
                      {entry.value.toLocaleString()}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between font-bold">
            <span className="text-zinc-400">
              {chartType === 'cumulative' ? 'Total Milestone:' : 'Month Total:'}
            </span>
            <span className="text-amber-400 font-mono text-xs">
              {currencySymbol}
              {totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 py-2">
      {/* Top Controls & Financial Scope */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-400/10 border border-amber-400/20 rounded-xl text-amber-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Studio Revenue Analytics & Service Yield
            </h3>
            <p className="text-xs text-zinc-400">
              Real-time cash flow & projected yield across creative service verticals.
            </p>
          </div>
        </div>

        {/* Filters and Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Revenue Basis Toggle */}
          <div className="flex items-center p-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs">
            <button
              onClick={() => setRevenueBasis('realized')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                revenueBasis === 'realized'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Cash actually received (completed orders + 50% deposits)"
            >
              Realized Cash (Paid)
            </button>
            <button
              onClick={() => setRevenueBasis('booked')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                revenueBasis === 'booked'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Full contract value of all orders booked"
            >
              Total Booked Value
            </button>
          </div>

          {/* Export CSV Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportFullCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-200 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 rounded-lg transition-colors cursor-pointer"
              title="Download full commission ledger CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Ledger CSV</span>
            </button>
            <button
              onClick={handleExportMonthlyCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-200 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 rounded-lg transition-colors cursor-pointer"
              title="Download monthly aggregated revenue CSV report"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Monthly Report CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Export Toast Banner */}
      {toastMessage && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs text-emerald-300 shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-400 hover:text-white font-mono cursor-pointer ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Realized Cash In Bank */}
        <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Cash Realized (M-Pesa / USD)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums tracking-tight">
            {currencySymbol}
            {totals.totalRealized.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <span>Collected via 50% deposits & balances</span>
          </div>
        </div>

        {/* Card 2: Total Booked Pipeline */}
        <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Total Booked Pipeline</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums tracking-tight">
            {currencySymbol}
            {totals.totalBooked.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-400">
            Across <span className="text-white font-bold">{totals.totalOrdersCount} orders</span> booked
          </div>
        </div>

        {/* Card 3: Pending Receivables */}
        <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Pending Receivables</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono tabular-nums tracking-tight">
            {currencySymbol}
            {totals.totalPendingReceivables.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-400">Due upon clean draft approvals</div>
        </div>

        {/* Card 4: Top Service Vertical */}
        <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Top Performing Vertical</span>
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-base font-bold text-white truncate font-display">
            {totals.topCategory?.name || 'Commissions'}
          </div>
          <div className="text-[11px] text-amber-400 font-mono font-semibold">
            {currencySymbol}
            {(totals.topCategory?.value || 0).toLocaleString()} (
            {totals.totalBooked > 0
              ? Math.round(((totals.topCategory?.value || 0) / totals.totalBooked) * 100)
              : 0}
            % of revenue)
          </div>
        </div>
      </div>

      {/* Main Chart Section: Total Earnings Over Time Categorized by Service Type */}
      <div className="p-6 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>Earnings Over Time Categorized by Service Type</span>
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Tracking monthly revenue velocity across Custom Portraits, Celebration Posters, Digital Prints, and BIT Tech.
            </p>
          </div>

          {/* Chart Type Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                chartType === 'area'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Stacked Area
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                chartType === 'bar'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Monthly Bars
            </button>
            <button
              onClick={() => setChartType('cumulative')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                chartType === 'cumulative'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Cumulative Growth
            </button>
          </div>
        </div>

        {/* Legend pills */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {Object.entries(CATEGORY_CONFIG).map(([key, item]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-zinc-300 font-medium">{item.label}</span>
            </div>
          ))}
          {chartType === 'cumulative' && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-emerald-400" />
              <span className="text-zinc-300 font-medium">Cumulative Total</span>
            </div>
          )}
        </div>

        {/* Recharts Canvas */}
        <div className="w-full h-80 pt-2">
          <ResponsiveContainer width="100%" height={320}>
            {chartType === 'area' ? (
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradCommissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gradMarketing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gradPrints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gradTech" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                <XAxis
                  dataKey="monthLabel"
                  stroke="#71717A"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#3F3F46' }}
                />
                <YAxis
                  stroke="#71717A"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#3F3F46' }}
                  tickFormatter={(val) =>
                    val >= 1000 ? `${currencySymbol}${val / 1000}k` : `${currencySymbol}${val}`
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="tech"
                  name={CATEGORY_CONFIG.tech.label}
                  stackId="1"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fill="url(#gradTech)"
                />
                <Area
                  type="monotone"
                  dataKey="commissions"
                  name={CATEGORY_CONFIG.commissions.label}
                  stackId="1"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fill="url(#gradCommissions)"
                />
                <Area
                  type="monotone"
                  dataKey="marketing"
                  name={CATEGORY_CONFIG.marketing.label}
                  stackId="1"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#gradMarketing)"
                />
                <Area
                  type="monotone"
                  dataKey="prints"
                  name={CATEGORY_CONFIG.prints.label}
                  stackId="1"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  fill="url(#gradPrints)"
                />
              </AreaChart>
            ) : chartType === 'bar' ? (
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                <XAxis
                  dataKey="monthLabel"
                  stroke="#71717A"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#3F3F46' }}
                />
                <YAxis
                  stroke="#71717A"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#3F3F46' }}
                  tickFormatter={(val) =>
                    val >= 1000 ? `${currencySymbol}${val / 1000}k` : `${currencySymbol}${val}`
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="tech"
                  name={CATEGORY_CONFIG.tech.label}
                  stackId="a"
                  fill="#8B5CF6"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="commissions"
                  name={CATEGORY_CONFIG.commissions.label}
                  stackId="a"
                  fill="#F59E0B"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="marketing"
                  name={CATEGORY_CONFIG.marketing.label}
                  stackId="a"
                  fill="#10B981"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="prints"
                  name={CATEGORY_CONFIG.prints.label}
                  stackId="a"
                  fill="#06B6D4"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : (
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradCumulative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                <XAxis
                  dataKey="monthLabel"
                  stroke="#71717A"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#3F3F46' }}
                />
                <YAxis
                  stroke="#71717A"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#3F3F46' }}
                  tickFormatter={(val) =>
                    val >= 1000 ? `${currencySymbol}${val / 1000}k` : `${currencySymbol}${val}`
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="cumulative"
                  name="Cumulative Revenue"
                  stroke="#10B981"
                  strokeWidth={3}
                  fill="url(#gradCumulative)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lower Section: Category Breakdown Donut & Strategic Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Donut Chart: Revenue Share by Service Type */}
        <div className="lg:col-span-6 p-6 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              <span>Revenue Distribution by Service</span>
            </h4>
            <span className="text-xs text-zinc-500 font-mono">100% Breakdown</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
            {/* Recharts PieChart */}
            <div className="w-44 h-44 shrink-0">
              <ResponsiveContainer width="100%" height={176}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#18181B" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [
                      `${currencySymbol}${Number(value).toLocaleString()}`,
                      'Revenue',
                    ]}
                    contentStyle={{
                      backgroundColor: '#090A0F',
                      border: '1px solid #27272A',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Stats List */}
            <div className="flex-1 w-full space-y-2.5 text-xs">
              {categoryBreakdown.map((cat) => {
                const percent =
                  totals.totalBooked > 0
                    ? Math.round((cat.value / totals.totalBooked) * 100)
                    : 0;

                return (
                  <div
                    key={cat.key}
                    className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cat.color }} />
                      <div>
                        <div className="font-semibold text-white">{cat.name}</div>
                        <div className="text-[10px] text-zinc-500">
                          {cat.count} order{cat.count === 1 ? '' : 's'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-white">
                        {currencySymbol}
                        {cat.value.toLocaleString()}
                      </div>
                      <div className="text-[10px] font-mono text-amber-400">{percent}% share</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Strategic Monetization Insights (Kenya + BIT Alignment) */}
        <div className="lg:col-span-6 p-6 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Studio Growth Observations & Recommendations</span>
            </h4>
            <span className="text-xs text-amber-400 font-mono font-semibold">BIT Analysis</span>
          </div>

          <div className="space-y-3 text-xs leading-relaxed">
            <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="text-emerald-400">●</span>
                <span>High Margin Velocity: Celebration Posters</span>
              </div>
              <p className="text-zinc-400">
                Luxury Birthday Posters generate rapid cash turnaround (2–3 days). In Kenya, weekend birthday celebrations on Instagram and WhatsApp status are consistent weekly demand drivers.
              </p>
            </div>

            <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="text-violet-400">●</span>
                <span>High Ticket Expansion: Tech Brand Packages</span>
              </div>
              <p className="text-zinc-400">
                Your Business Information Technology background enables you to bundle UI kits, Figma design systems, and brand vectors at {currency === 'KSH' ? 'KSh 25,000+' : '$220+'}, pulling studio average order value up significantly.
              </p>
            </div>

            <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="text-cyan-400">●</span>
                <span>Passive Income Foundation: Digital Wallpapers</span>
              </div>
              <p className="text-zinc-400">
                Digital prints provide zero marginal cost sales. Keep accumulating OLED mobile wallpaper designs to build recurring M-Pesa / Gumroad streams while fulfilling active bespoke portraits.
              </p>
            </div>
          </div>

          {onOpenPricing && (
            <div className="pt-2">
              <button
                onClick={onOpenPricing}
                className="w-full py-2.5 px-4 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer text-center shadow-sm"
              >
                Open Pricing & Quote Calculator →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
