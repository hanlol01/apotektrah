import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DbDoctor {
  id: string;
  name: string;
  sip_number: string;
  specialization: string;
  hospital: string;
  created_at: string;
  updated_at: string;
}

export function useDoctors() {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as DbDoctor[];
    },
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (doctor: Omit<DbDoctor, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('doctors')
        .insert(doctor)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
}
