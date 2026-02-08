-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sip_number TEXT NOT NULL,
  specialization TEXT NOT NULL,
  hospital TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  birth_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medicines table
CREATE TABLE public.medicines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  generic_name TEXT NOT NULL,
  unit TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL CHECK (category IN ('obat-keras', 'obat-bebas', 'obat-bebas-terbatas', 'narkotika', 'psikotropika')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_number TEXT NOT NULL UNIQUE,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE RESTRICT,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE RESTRICT,
  prescription_type TEXT NOT NULL CHECK (prescription_type IN ('regular', 'compound')),
  subtotal NUMERIC NOT NULL DEFAULT 0,
  service_fee NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prescription_items table (for regular prescriptions)
CREATE TABLE public.prescription_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1,
  dosage TEXT NOT NULL,
  instructions TEXT,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create compound_prescriptions table (for compound prescriptions)
CREATE TABLE public.compound_prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  form TEXT NOT NULL CHECK (form IN ('kapsul', 'puyer', 'salep', 'sirup')),
  total_amount INTEGER NOT NULL DEFAULT 1,
  dosage TEXT NOT NULL,
  instructions TEXT,
  service_fee NUMERIC NOT NULL DEFAULT 0,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create compound_items table (items in compound prescriptions)
CREATE TABLE public.compound_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  compound_prescription_id UUID NOT NULL REFERENCES public.compound_prescriptions(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE RESTRICT,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stock_opname table
CREATE TABLE public.stock_opname (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE RESTRICT,
  system_stock INTEGER NOT NULL,
  actual_stock INTEGER NOT NULL,
  difference INTEGER NOT NULL,
  notes TEXT,
  opname_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables (public access for POS system)
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compound_prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compound_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_opname ENABLE ROW LEVEL SECURITY;

-- Create public read/write policies (POS system - no user auth required)
CREATE POLICY "Allow public read doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Allow public insert doctors" ON public.doctors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update doctors" ON public.doctors FOR UPDATE USING (true);
CREATE POLICY "Allow public delete doctors" ON public.doctors FOR DELETE USING (true);

CREATE POLICY "Allow public read patients" ON public.patients FOR SELECT USING (true);
CREATE POLICY "Allow public insert patients" ON public.patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update patients" ON public.patients FOR UPDATE USING (true);
CREATE POLICY "Allow public delete patients" ON public.patients FOR DELETE USING (true);

CREATE POLICY "Allow public read medicines" ON public.medicines FOR SELECT USING (true);
CREATE POLICY "Allow public insert medicines" ON public.medicines FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update medicines" ON public.medicines FOR UPDATE USING (true);
CREATE POLICY "Allow public delete medicines" ON public.medicines FOR DELETE USING (true);

CREATE POLICY "Allow public read transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert transactions" ON public.transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update transactions" ON public.transactions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete transactions" ON public.transactions FOR DELETE USING (true);

CREATE POLICY "Allow public read prescription_items" ON public.prescription_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert prescription_items" ON public.prescription_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update prescription_items" ON public.prescription_items FOR UPDATE USING (true);
CREATE POLICY "Allow public delete prescription_items" ON public.prescription_items FOR DELETE USING (true);

CREATE POLICY "Allow public read compound_prescriptions" ON public.compound_prescriptions FOR SELECT USING (true);
CREATE POLICY "Allow public insert compound_prescriptions" ON public.compound_prescriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update compound_prescriptions" ON public.compound_prescriptions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete compound_prescriptions" ON public.compound_prescriptions FOR DELETE USING (true);

CREATE POLICY "Allow public read compound_items" ON public.compound_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert compound_items" ON public.compound_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update compound_items" ON public.compound_items FOR UPDATE USING (true);
CREATE POLICY "Allow public delete compound_items" ON public.compound_items FOR DELETE USING (true);

CREATE POLICY "Allow public read stock_opname" ON public.stock_opname FOR SELECT USING (true);
CREATE POLICY "Allow public insert stock_opname" ON public.stock_opname FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update stock_opname" ON public.stock_opname FOR UPDATE USING (true);
CREATE POLICY "Allow public delete stock_opname" ON public.stock_opname FOR DELETE USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON public.medicines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial doctor data
INSERT INTO public.doctors (name, sip_number, specialization, hospital) VALUES
  ('dr. Ahmad Santoso, Sp.PD', 'SIP-2024/001/PD', 'Penyakit Dalam', 'RS Sehat Sejahtera'),
  ('dr. Siti Rahayu, Sp.A', 'SIP-2024/002/A', 'Anak', 'RS Bunda Kasih'),
  ('dr. Budi Pratama', 'SIP-2024/003/U', 'Umum', 'Klinik Sehat'),
  ('dr. Dewi Anggraini, Sp.KK', 'SIP-2024/004/KK', 'Kulit dan Kelamin', 'RS Dermata');

-- Insert initial medicine data
INSERT INTO public.medicines (name, generic_name, unit, price, stock, category) VALUES
  ('Amoxicillin 500mg', 'Amoxicillin', 'Kapsul', 2500, 150, 'obat-keras'),
  ('Paracetamol 500mg', 'Paracetamol', 'Tablet', 500, 500, 'obat-bebas'),
  ('Omeprazole 20mg', 'Omeprazole', 'Kapsul', 3500, 80, 'obat-keras'),
  ('Cetirizine 10mg', 'Cetirizine', 'Tablet', 1500, 200, 'obat-bebas-terbatas'),
  ('Metformin 500mg', 'Metformin', 'Tablet', 800, 300, 'obat-keras'),
  ('Vitamin C 500mg', 'Ascorbic Acid', 'Tablet', 300, 1000, 'obat-bebas'),
  ('Ibuprofen 400mg', 'Ibuprofen', 'Tablet', 1200, 250, 'obat-bebas-terbatas'),
  ('Lansoprazole 30mg', 'Lansoprazole', 'Kapsul', 4500, 60, 'obat-keras'),
  ('Salbutamol 2mg', 'Salbutamol', 'Tablet', 1000, 100, 'obat-keras'),
  ('Dexamethasone 0.5mg', 'Dexamethasone', 'Tablet', 2000, 120, 'obat-keras');