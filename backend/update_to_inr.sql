-- Update currency to INR and prices
UPDATE subscription_plans SET price = 1499 WHERE name = 'Monthly Pro';
UPDATE subscription_plans SET price = 14999 WHERE name = 'Yearly Pro';
UPDATE subscription_plans SET price = 39999 WHERE name = 'Lifetime Pro';

-- Update default currency
ALTER TABLE payments ALTER COLUMN currency SET DEFAULT 'INR';
