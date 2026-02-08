import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DbMedicine {
  id: string;
  name: string;
  generic_name: string;
  unit: string;
  price: number;
  stock: number;
  category: 'obat-keras' | 'obat-bebas' | 'obat-bebas-terbatas' | 'narkotika' | 'psikotropika';
  created_at: string;
  updated_at: string;
}

export function useMedicines() {
  return useQuery({
    queryKey: ['medicines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as DbMedicine[];
    },
  });
}

export function useUpdateMedicineStock() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, stock }: { id: string; stock: number }) => {
      const { data, error } = await supabase
        .from('medicines')
        .update({ stock })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
  });
}

export function useCreateMedicine() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (medicine: Omit<DbMedicine, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('medicines')
        .insert(medicine)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
  });
}
