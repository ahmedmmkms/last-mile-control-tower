-- Migration: Enhance shipments table for PoD and status tracking
-- Date: 2025-09-18
-- Description: Add fields for Proof of Delivery and enhanced status tracking

-- Add columns to shipments table
ALTER TABLE shipments 
ADD COLUMN IF NOT EXISTS pod_image TEXT,
ADD COLUMN IF NOT EXISTS pod_timestamp TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS pod_location JSONB,
ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]';

-- Update existing shipments to have empty status history
UPDATE shipments 
SET status_history = '[]' 
WHERE status_history IS NULL;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_shipments_pod_timestamp ON shipments(pod_timestamp);
CREATE INDEX IF NOT EXISTS idx_shipments_status_history ON shipments USING GIN (status_history);