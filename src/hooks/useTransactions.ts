import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DbTransaction {
  id: string;
  transaction_number: string;
  date: string;
  patient_id: string;
  doctor_id: string;
  prescription_type: 'regular' | 'compound';
  subtotal: number;
  service_fee: number;
  total: number;
  payment_status: 'pending' | 'paid' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbPrescriptionItem {
  id: string;
  transaction_id: string;
  medicine_id: string;
  quantity: number;
  dosage: string;
  instructions: string | null;
  subtotal: number;
  created_at: string;
}

export interface DbCompoundPrescription {
  id: string;
  transaction_id: string;
  form: 'kapsul' | 'puyer' | 'salep' | 'sirup';
  total_amount: number;
  dosage: string;
  instructions: string | null;
  service_fee: number;
  subtotal: number;
  created_at: string;
}

export interface DbCompoundItem {
  id: string;
  compound_prescription_id: string;
  medicine_id: string;
  quantity: number;
  unit: string;
  created_at: string;
}

export interface TransactionWithDetails extends DbTransaction {
  patients: { name: string } | null;
  doctors: { name: string } | null;
  prescription_items: (DbPrescriptionItem & { medicines: { name: string } | null })[];
  compound_prescriptions: (DbCompoundPrescription & {
    compound_items: (DbCompoundItem & { medicines: { name: string } | null })[];
  })[];
}

export function useTransactions(filters?: {
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          patients:patient_id(name),
          doctors:doctor_id(name),
          prescription_items(*, medicines:medicine_id(name)),
          compound_prescriptions(*, compound_items(*, medicines:medicine_id(name)))
        `)
        .order('date', { ascending: false });

      if (filters?.type && filters.type !== 'all') {
        query = query.eq('prescription_type', filters.type);
      }
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('payment_status', filters.status);
      }
      if (filters?.startDate) {
        query = query.gte('date', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('date', filters.endDate);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as TransactionWithDetails[];
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      transaction,
      prescriptionItems,
      compoundPrescriptions,
    }: {
      transaction: Omit<DbTransaction, 'id' | 'created_at' | 'updated_at'>;
      prescriptionItems?: Omit<DbPrescriptionItem, 'id' | 'transaction_id' | 'created_at'>[];
      compoundPrescriptions?: {
        prescription: Omit<DbCompoundPrescription, 'id' | 'transaction_id' | 'created_at'>;
        items: Omit<DbCompoundItem, 'id' | 'compound_prescription_id' | 'created_at'>[];
      }[];
    }) => {
      // Create transaction
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .insert(transaction)
        .select()
        .single();
      
      if (txError) throw txError;

      // Create prescription items
      if (prescriptionItems && prescriptionItems.length > 0) {
        const itemsWithTxId = prescriptionItems.map(item => ({
          ...item,
          transaction_id: txData.id,
        }));
        
        const { error: itemsError } = await supabase
          .from('prescription_items')
          .insert(itemsWithTxId);
        
        if (itemsError) throw itemsError;

        // Update stock for each medicine
        for (const item of prescriptionItems) {
          const { data: medicine } = await supabase
            .from('medicines')
            .select('stock')
            .eq('id', item.medicine_id)
            .single();
          
          if (medicine) {
            await supabase
              .from('medicines')
              .update({ stock: medicine.stock - item.quantity })
              .eq('id', item.medicine_id);
          }
        }
      }

      // Create compound prescriptions
      if (compoundPrescriptions && compoundPrescriptions.length > 0) {
        for (const cp of compoundPrescriptions) {
          const { data: cpData, error: cpError } = await supabase
            .from('compound_prescriptions')
            .insert({
              ...cp.prescription,
              transaction_id: txData.id,
            })
            .select()
            .single();
          
          if (cpError) throw cpError;

          if (cp.items.length > 0) {
            const itemsWithCpId = cp.items.map(item => ({
              ...item,
              compound_prescription_id: cpData.id,
            }));
            
            const { error: cpItemsError } = await supabase
              .from('compound_items')
              .insert(itemsWithCpId);
            
            if (cpItemsError) throw cpItemsError;

            // Update stock for compound items
            for (const item of cp.items) {
              const { data: medicine } = await supabase
                .from('medicines')
                .select('stock')
                .eq('id', item.medicine_id)
                .single();
              
              if (medicine) {
                await supabase
                  .from('medicines')
                  .update({ stock: Math.max(0, medicine.stock - Math.ceil(item.quantity)) })
                  .eq('id', item.medicine_id);
              }
            }
          }
        }
      }

      return txData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
  });
}

export function useUpdateTransactionStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: DbTransaction['payment_status'] }) => {
      const { data, error } = await supabase
        .from('transactions')
        .update({ payment_status: status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

// Helper to generate transaction number
export function generateTransactionNumber(): string {
  const year = new Date().getFullYear();
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `TRX-${year}-${random}`;
}
