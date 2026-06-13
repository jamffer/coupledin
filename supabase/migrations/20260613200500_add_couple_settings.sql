ALTER TABLE couples ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{"divisionModel": "proportional", "percentageA": 50, "percentageB": 50}'::jsonb;
