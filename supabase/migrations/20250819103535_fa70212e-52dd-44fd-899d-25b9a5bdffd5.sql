
-- Fix the generate_api_key function to use a working method for generating random strings
CREATE OR REPLACE FUNCTION public.generate_api_key()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  key_prefix TEXT := 'wm_';
  random_part TEXT;
  full_key TEXT;
BEGIN
  -- Generate random 32 character string using extensions/pgcrypto gen_random_uuid
  random_part := replace(gen_random_uuid()::text, '-', '');
  -- Add more randomness by concatenating another UUID
  random_part := random_part || replace(gen_random_uuid()::text, '-', '');
  -- Take first 32 characters and make it uppercase for better readability
  random_part := upper(substring(random_part, 1, 32));
  full_key := key_prefix || random_part;
  RETURN full_key;
END;
$function$
