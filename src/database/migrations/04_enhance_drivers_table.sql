-- Migration: Enhance drivers table for PWA and live tracking
-- Date: 2025-09-18
-- Description: Add fields for location history, availability, and last active timestamp

-- Add columns to drivers table
ALTER TABLE drivers 
ADD COLUMN IF NOT EXISTS location_history JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS availability BOOLEAN DEFAULT true;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_drivers_last_active ON drivers(last_active);
CREATE INDEX IF NOT EXISTS idx_drivers_availability ON drivers(availability);