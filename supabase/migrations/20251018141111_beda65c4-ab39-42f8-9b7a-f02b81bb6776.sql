-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
  salary DECIMAL(12,2),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  avatar_url TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (can be changed later for authenticated users only)
CREATE POLICY "Allow public read access to employees"
ON public.employees
FOR SELECT
USING (true);

CREATE POLICY "Allow public insert access to employees"
ON public.employees
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update access to employees"
ON public.employees
FOR UPDATE
USING (true);

CREATE POLICY "Allow public delete access to employees"
ON public.employees
FOR DELETE
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_employees_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_employees_updated_at
BEFORE UPDATE ON public.employees
FOR EACH ROW
EXECUTE FUNCTION public.update_employees_updated_at();

-- Create index for better search performance
CREATE INDEX idx_employees_name ON public.employees(full_name);
CREATE INDEX idx_employees_email ON public.employees(email);
CREATE INDEX idx_employees_department ON public.employees(department);
CREATE INDEX idx_employees_status ON public.employees(status);