-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'pharmacist', 'staff');

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents infinite recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is authenticated
CREATE OR REPLACE FUNCTION public.is_authenticated()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop all existing public policies on patients table
DROP POLICY IF EXISTS "Allow public read patients" ON public.patients;
DROP POLICY IF EXISTS "Allow public insert patients" ON public.patients;
DROP POLICY IF EXISTS "Allow public update patients" ON public.patients;
DROP POLICY IF EXISTS "Allow public delete patients" ON public.patients;

-- Create authenticated-only policies for patients table
CREATE POLICY "Authenticated users can read patients"
  ON public.patients FOR SELECT
  USING (public.is_authenticated());

CREATE POLICY "Authenticated users can insert patients"
  ON public.patients FOR INSERT
  WITH CHECK (public.is_authenticated());

CREATE POLICY "Authenticated users can update patients"
  ON public.patients FOR UPDATE
  USING (public.is_authenticated());

CREATE POLICY "Authenticated users can delete patients"
  ON public.patients FOR DELETE
  USING (public.is_authenticated());

-- Drop all existing public policies on transactions table
DROP POLICY IF EXISTS "Allow public read transactions" ON public.transactions;
DROP POLICY IF EXISTS "Allow public insert transactions" ON public.transactions;
DROP POLICY IF EXISTS "Allow public update transactions" ON public.transactions;
DROP POLICY IF EXISTS "Allow public delete transactions" ON public.transactions;

-- Create authenticated-only policies for transactions table
CREATE POLICY "Authenticated users can read transactions"
  ON public.transactions FOR SELECT
  USING (public.is_authenticated());

CREATE POLICY "Authenticated users can insert transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (public.is_authenticated());

CREATE POLICY "Authenticated users can update transactions"
  ON public.transactions FOR UPDATE
  USING (public.is_authenticated());

CREATE POLICY "Authenticated users can delete transactions"
  ON public.transactions FOR DELETE
  USING (public.is_authenticated());

-- Also secure related tables that reference patients/transactions
-- prescription_items
DROP POLICY IF EXISTS "Allow public read prescription_items" ON public.prescription_items;
DROP POLICY IF EXISTS "Allow public insert prescription_items" ON public.prescription_items;
DROP POLICY IF EXISTS "Allow public update prescription_items" ON public.prescription_items;
DROP POLICY IF EXISTS "Allow public delete prescription_items" ON public.prescription_items;

CREATE POLICY "Authenticated users can read prescription_items"
  ON public.prescription_items FOR SELECT
  USING (public.is_authenticated());

CREATE POLICY "Authenticated users can insert prescription_items"
  ON public.prescription_items FOR INSERT
  WITH CHECK (public.is_authenticated());

CREATE POLICY "Authenticated users can update prescription_items"
  ON public.prescription_items FOR UPDATE
  USING (public.is_authenticated());

CREATE POLICY "Authenticated users can delete prescription_items"
  ON public.prescription_items FOR DELETE
  USING (public.is_authenticated());

-- compound_prescriptions
DROP POLICY IF EXISTS "Allow public read compound_prescriptions" ON public.compound_prescriptions;
DROP POLICY IF EXISTS "Allow public insert compound_prescriptions" ON public.compound_prescriptions;
DROP POLICY IF EXISTS "Allow public update compound_prescriptions" ON public.compound_prescriptions;
DROP POLICY IF EXISTS "Allow public delete compound_prescriptions" ON public.compound_prescriptions;

CREATE POLICY "Authenticated users can read compound_prescriptions"
  ON public.compound_prescriptions FOR SELECT
  USING (public.is_authenticated());

CREATE POLICY "Authenticated users can insert compound_prescriptions"
  ON public.compound_prescriptions FOR INSERT
  WITH CHECK (public.is_authenticated());

CREATE POLICY "Authenticated users can update compound_prescriptions"
  ON public.compound_prescriptions FOR UPDATE
  USING (public.is_authenticated());

CREATE POLICY "Authenticated users can delete compound_prescriptions"
  ON public.compound_prescriptions FOR DELETE
  USING (public.is_authenticated());

-- compound_items
DROP POLICY IF EXISTS "Allow public read compound_items" ON public.compound_items;
DROP POLICY IF EXISTS "Allow public insert compound_items" ON public.compound_items;
DROP POLICY IF EXISTS "Allow public update compound_items" ON public.compound_items;
DROP POLICY IF EXISTS "Allow public delete compound_items" ON public.compound_items;

CREATE POLICY "Authenticated users can read compound_items"
  ON public.compound_items FOR SELECT
  USING (public.is_authenticated());

CREATE POLICY "Authenticated users can insert compound_items"
  ON public.compound_items FOR INSERT
  WITH CHECK (public.is_authenticated());

CREATE POLICY "Authenticated users can update compound_items"
  ON public.compound_items FOR UPDATE
  USING (public.is_authenticated());

CREATE POLICY "Authenticated users can delete compound_items"
  ON public.compound_items FOR DELETE
  USING (public.is_authenticated());

-- stock_opname
DROP POLICY IF EXISTS "Allow public read stock_opname" ON public.stock_opname;
DROP POLICY IF EXISTS "Allow public insert stock_opname" ON public.stock_opname;
DROP POLICY IF EXISTS "Allow public update stock_opname" ON public.stock_opname;
DROP POLICY IF EXISTS "Allow public delete stock_opname" ON public.stock_opname;

CREATE POLICY "Authenticated users can read stock_opname"
  ON public.stock_opname FOR SELECT
  USING (public.is_authenticated());

CREATE POLICY "Authenticated users can insert stock_opname"
  ON public.stock_opname FOR INSERT
  WITH CHECK (public.is_authenticated());

CREATE POLICY "Authenticated users can update stock_opname"
  ON public.stock_opname FOR UPDATE
  USING (public.is_authenticated());

CREATE POLICY "Authenticated users can delete stock_opname"
  ON public.stock_opname FOR DELETE
  USING (public.is_authenticated());

-- medicines (keep read public for viewing catalog, but require auth for writes)
DROP POLICY IF EXISTS "Allow public insert medicines" ON public.medicines;
DROP POLICY IF EXISTS "Allow public update medicines" ON public.medicines;
DROP POLICY IF EXISTS "Allow public delete medicines" ON public.medicines;

CREATE POLICY "Authenticated users can insert medicines"
  ON public.medicines FOR INSERT
  WITH CHECK (public.is_authenticated());

CREATE POLICY "Authenticated users can update medicines"
  ON public.medicines FOR UPDATE
  USING (public.is_authenticated());

CREATE POLICY "Authenticated users can delete medicines"
  ON public.medicines FOR DELETE
  USING (public.is_authenticated());

-- doctors (keep read public for viewing, but require auth for writes)
DROP POLICY IF EXISTS "Allow public insert doctors" ON public.doctors;
DROP POLICY IF EXISTS "Allow public update doctors" ON public.doctors;
DROP POLICY IF EXISTS "Allow public delete doctors" ON public.doctors;

CREATE POLICY "Authenticated users can insert doctors"
  ON public.doctors FOR INSERT
  WITH CHECK (public.is_authenticated());

CREATE POLICY "Authenticated users can update doctors"
  ON public.doctors FOR UPDATE
  USING (public.is_authenticated());

CREATE POLICY "Authenticated users can delete doctors"
  ON public.doctors FOR DELETE
  USING (public.is_authenticated());