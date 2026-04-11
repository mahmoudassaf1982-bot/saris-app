
CREATE TABLE public.diamond_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  price_usd NUMERIC(10,2) NOT NULL,
  duration_months INTEGER NOT NULL DEFAULT 1,
  country_id TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.diamond_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active diamond plans"
  ON public.diamond_plans
  FOR SELECT
  USING (is_active = true);

INSERT INTO public.diamond_plans (name_ar, price_usd, duration_months, country_id, is_active)
VALUES ('اشتراك Diamond', 59.99, 3, 'kw', true);
