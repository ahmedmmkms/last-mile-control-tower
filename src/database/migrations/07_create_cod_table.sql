-- Migration: Create COD table for Cash on Delivery tracking
-- Date: 2025-09-18
-- Description: Create table for tracking Cash on Delivery payments and reconciliation

-- Create the cod_payments table
CREATE TABLE IF NOT EXISTS cod_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'EGP',
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, collected, reconciled, failed
  collected_at TIMESTAMP WITH TIME ZONE,
  reconciled_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cod_payments_shipment_id ON cod_payments(shipment_id);
CREATE INDEX IF NOT EXISTS idx_cod_payments_driver_id ON cod_payments(driver_id);
CREATE INDEX IF NOT EXISTS idx_cod_payments_status ON cod_payments(status);
CREATE INDEX IF NOT EXISTS idx_cod_payments_collected_at ON cod_payments(collected_at);
CREATE INDEX IF NOT EXISTS idx_cod_payments_reconciled_at ON cod_payments(reconciled_at);

-- Add COD amount field to shipments table
ALTER TABLE shipments 
ADD COLUMN IF NOT EXISTS cod_amount DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS cod_status VARCHAR(20) DEFAULT 'pending'; -- pending, collected, reconciled, failed

-- Create indexes for new COD fields in shipments table
CREATE INDEX IF NOT EXISTS idx_shipments_cod_amount ON shipments(cod_amount);
CREATE INDEX IF NOT EXISTS idx_shipments_cod_status ON shipments(cod_status);