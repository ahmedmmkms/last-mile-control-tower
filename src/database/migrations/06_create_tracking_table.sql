-- Migration: Create tracking table for live tracking
-- Date: 2025-09-18
-- Description: Create table for storing tracking updates and history

-- Create the tracking table
CREATE TABLE IF NOT EXISTS tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  location JSONB NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  event_type VARCHAR(50), -- e.g., 'location_update', 'status_change', 'assignment'
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tracking_shipment_id ON tracking(shipment_id);
CREATE INDEX IF NOT EXISTS idx_tracking_driver_id ON tracking(driver_id);
CREATE INDEX IF NOT EXISTS idx_tracking_timestamp ON tracking(timestamp);
CREATE INDEX IF NOT EXISTS idx_tracking_event_type ON tracking(event_type);