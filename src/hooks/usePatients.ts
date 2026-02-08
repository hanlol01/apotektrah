import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DbPatient {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  birth_date: string | null;
  created_at: string;
  updated_at: string;
}

export function usePatients() {
  return useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as DbPatient[];
    },
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (patient: Omit<DbPatient, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('patients')
        .insert(patient)
        .select()
        .single();
      
      if (error) throw error;
      return data as DbPatient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

export function useSearchPatients(searchTerm: string) {
  return useQuery({
    queryKey: ['patients', 'search', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .limit(10);
      
      if (error) throw error;
      return data as DbPatient[];
    },
    enabled: searchTerm.length >= 2,
  });
}
