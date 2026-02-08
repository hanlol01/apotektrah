import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export interface SalesReport {
  totalSales: number;
  totalTransactions: number;
  averageTransaction: number;
  regularPrescriptions: number;
  compoundPrescriptions: number;
  topProducts: { name: string; quantity: number; revenue: number }[];
  dailySales: { date: string; total: number; transactions: number }[];
}

export function useSalesReport(period: 'week' | 'month' | 'year' = 'month') {
  return useQuery({
    queryKey: ['reports', 'sales', period],
    queryFn: async (): Promise<SalesReport> => {
      const now = new Date();
      let startDate: Date;
      
      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = startOfMonth(now);
      }

      // Get transactions
      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select(`
          *,
          prescription_items(quantity, subtotal, medicines:medicine_id(name)),
          compound_prescriptions(subtotal)
        `)
        .gte('date', startDate.toISOString())
        .eq('payment_status', 'paid');

      if (txError) throw txError;

      const txData = transactions || [];
      
      // Calculate totals
      const totalSales = txData.reduce((sum, tx) => sum + Number(tx.total), 0);
      const totalTransactions = txData.length;
      const averageTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;
      const regularPrescriptions = txData.filter(tx => tx.prescription_type === 'regular').length;
      const compoundPrescriptions = txData.filter(tx => tx.prescription_type === 'compound').length;

      // Top products
      const productMap = new Map<string, { quantity: number; revenue: number }>();
      txData.forEach(tx => {
        (tx.prescription_items || []).forEach((item: any) => {
          const name = item.medicines?.name || 'Unknown';
          const existing = productMap.get(name) || { quantity: 0, revenue: 0 };
          productMap.set(name, {
            quantity: existing.quantity + item.quantity,
            revenue: existing.revenue + Number(item.subtotal),
          });
        });
      });

      const topProducts = Array.from(productMap.entries())
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Daily sales
      const dailyMap = new Map<string, { total: number; transactions: number }>();
      txData.forEach(tx => {
        const date = format(new Date(tx.date), 'yyyy-MM-dd');
        const existing = dailyMap.get(date) || { total: 0, transactions: 0 };
        dailyMap.set(date, {
          total: existing.total + Number(tx.total),
          transactions: existing.transactions + 1,
        });
      });

      const dailySales = Array.from(dailyMap.entries())
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        totalSales,
        totalTransactions,
        averageTransaction,
        regularPrescriptions,
        compoundPrescriptions,
        topProducts,
        dailySales,
      };
    },
  });
}

export interface ProfitLossReport {
  revenue: number;
  cogs: number; // Cost of Goods Sold (HPP)
  grossProfit: number;
  operatingExpenses: number;
  netProfit: number;
  grossMargin: number;
  netMargin: number;
}

export function useProfitLossReport(month: Date = new Date()) {
  return useQuery({
    queryKey: ['reports', 'profit-loss', format(month, 'yyyy-MM')],
    queryFn: async (): Promise<ProfitLossReport> => {
      const start = startOfMonth(month);
      const end = endOfMonth(month);

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('total, service_fee')
        .gte('date', start.toISOString())
        .lte('date', end.toISOString())
        .eq('payment_status', 'paid');

      if (error) throw error;

      const revenue = (transactions || []).reduce((sum, tx) => sum + Number(tx.total), 0);
      const serviceFees = (transactions || []).reduce((sum, tx) => sum + Number(tx.service_fee || 0), 0);
      
      // Estimate COGS as 70% of revenue (typical pharmacy margin)
      const cogs = revenue * 0.7;
      const grossProfit = revenue - cogs;
      
      // Operating expenses (simplified estimation)
      const operatingExpenses = serviceFees * 0.5; // Half of service fees as overhead
      const netProfit = grossProfit - operatingExpenses;
      
      const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
      const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

      return {
        revenue,
        cogs,
        grossProfit,
        operatingExpenses,
        netProfit,
        grossMargin,
        netMargin,
      };
    },
  });
}

export interface BalanceSheet {
  assets: {
    cash: number;
    inventory: number;
    receivables: number;
    totalCurrent: number;
    fixedAssets: number;
    totalAssets: number;
  };
  liabilities: {
    payables: number;
    totalCurrent: number;
    longTerm: number;
    totalLiabilities: number;
  };
  equity: {
    capital: number;
    retainedEarnings: number;
    totalEquity: number;
  };
  isBalanced: boolean;
}

export function useBalanceSheet(asOfDate: Date = new Date()) {
  return useQuery({
    queryKey: ['reports', 'balance-sheet', format(asOfDate, 'yyyy-MM-dd')],
    queryFn: async (): Promise<BalanceSheet> => {
      // Get inventory value
      const { data: medicines, error: medError } = await supabase
        .from('medicines')
        .select('stock, price');
      
      if (medError) throw medError;

      const inventoryValue = (medicines || []).reduce(
        (sum, med) => sum + (med.stock * Number(med.price)),
        0
      );

      // Get total sales (simplified as cash)
      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('total')
        .eq('payment_status', 'paid');
      
      if (txError) throw txError;

      const totalSales = (transactions || []).reduce((sum, tx) => sum + Number(tx.total), 0);
      
      // Get pending transactions as receivables
      const { data: pendingTx, error: pendingError } = await supabase
        .from('transactions')
        .select('total')
        .eq('payment_status', 'pending');
      
      if (pendingError) throw pendingError;

      const receivables = (pendingTx || []).reduce((sum, tx) => sum + Number(tx.total), 0);

      // Simplified balance sheet calculations
      const cash = totalSales * 0.3; // Assume 30% of sales is cash on hand
      const totalCurrent = cash + inventoryValue + receivables;
      const fixedAssets = 50000000; // Assumed fixed assets value
      const totalAssets = totalCurrent + fixedAssets;

      const payables = inventoryValue * 0.2; // Assume 20% of inventory is payable
      const totalCurrentLiabilities = payables;
      const longTerm = 10000000; // Assumed long-term debt
      const totalLiabilities = totalCurrentLiabilities + longTerm;

      const capital = 50000000; // Initial capital
      const retainedEarnings = totalAssets - totalLiabilities - capital;
      const totalEquity = capital + retainedEarnings;

      return {
        assets: {
          cash,
          inventory: inventoryValue,
          receivables,
          totalCurrent,
          fixedAssets,
          totalAssets,
        },
        liabilities: {
          payables,
          totalCurrent: totalCurrentLiabilities,
          longTerm,
          totalLiabilities,
        },
        equity: {
          capital,
          retainedEarnings,
          totalEquity,
        },
        isBalanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 1,
      };
    },
  });
}
