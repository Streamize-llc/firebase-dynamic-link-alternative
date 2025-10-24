-- Add source column to deeplinks table to distinguish UI vs API creation
ALTER TABLE deeplinks
ADD COLUMN source TEXT DEFAULT 'API' CHECK (source IN ('UI', 'API'));

-- Create index for faster filtering by source
CREATE INDEX idx_deeplinks_source ON deeplinks(source);

-- Update existing records to 'API' (default for existing data)
UPDATE deeplinks SET source = 'API' WHERE source IS NULL;
