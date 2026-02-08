import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DbStockOpname {
  id: string;
  medicine_id: string;
  system_stock: number;
  actual_stock: number;
  difference: number;
  notes: string | null;
  opname_date: string;
  created_at: string;
}

export interface StockOpnameWithMedicine extends DbStockOpname {
  medicines: { name: string; unit: string } | null;
}

export function useStockOpnameHistory() {
  return useQuery({
    queryKey: ['stock-opname'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stock_opname')
        .select(`
          *,
          medicines:medicine_id(name, unit)
        `)
        .order('opname_date', { ascending: false });
      
      if (error) throw error;
      return data as StockOpnameWithMedicine[];
    },
  });
}

export function useCreateStockOpname() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (opnameItems: Omit<DbStockOpname, 'id' | 'created_at'>[]) => {
      // Insert opname records
      const { data, error } = await supabase
        .from('stock_opname')
        .insert(opnameItems)
        .select();
      
      if (error) throw error;

      // Update medicine stock based on actual stock
      for (const item of opnameItems) {
        await supabase
          .from('medicines')
          .update({ stock: item.actual_stock })
          .eq('id', item.medicine_id);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-opname'] });
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
  });
}
