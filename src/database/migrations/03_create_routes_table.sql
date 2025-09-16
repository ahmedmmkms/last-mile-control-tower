-- Migration: Create routes table
-- Date: 2025-09-16
-- Description: Create the routes table to store route information

-- Create the routes table
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments(id),
  waypoints JSONB NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  estimated_time INTEGER, -- in minutes
  actual_time INTEGER, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_routes_shipment_id ON routes(shipment_id);
CREATE INDEX idx_routes_status ON routes(status);