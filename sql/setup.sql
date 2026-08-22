-- ============================================================
-- AgriFusion Hub — Database Setup Script
-- Run this ONCE in your Supabase SQL Editor (Dashboard → SQL Editor)
-- All changes are ADDITIVE — existing apps will NOT be affected.
-- ============================================================

-- ── STEP 1: Add new columns to existing farmers table ────────
-- These have safe defaults so existing rows keep working as-is.

ALTER TABLE farmers ADD COLUMN IF NOT EXISTS role         text    DEFAULT 'farmer';
ALTER TABLE farmers ADD COLUMN IF NOT EXISTS is_verified  boolean DEFAULT false;
ALTER TABLE farmers ADD COLUMN IF NOT EXISTS password_hash text;

-- Back-fill role for existing rows that have NULL
UPDATE farmers SET role = 'farmer'   WHERE role IS NULL;
UPDATE farmers SET is_verified = false WHERE is_verified IS NULL;

-- ── STEP 2: Create credit_costs table ───────────────────────
-- Stores the cost (₹) of 1 credit for each solution.
-- Admins can UPDATE these rows directly in the Supabase dashboard.

CREATE TABLE IF NOT EXISTS credit_costs (
  id               uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  solution_name    text    NOT NULL UNIQUE,
  cost_per_credit  numeric NOT NULL DEFAULT 100,
  updated_at       timestamptz DEFAULT now()
);

-- Default pricing (change as needed)
INSERT INTO credit_costs (solution_name, cost_per_credit) VALUES
  ('croplens',   100),
  ('dizmatrix',  150),
  ('senseorbit', 120),
  ('quallix',     80)
ON CONFLICT (solution_name) DO NOTHING;

-- ── STEP 3: Create carts table ───────────────────────────────

CREATE TABLE IF NOT EXISTS carts (
  id                  uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at          timestamptz DEFAULT now(),
  farmer_id           uuid    REFERENCES farmers(id) ON DELETE CASCADE,
  croplens_credits    int4    DEFAULT 0,
  dizmatrix_credits   int4    DEFAULT 0,
  senseorbit_credits  int4    DEFAULT 0,
  quallix_credits     int4    DEFAULT 0,
  total_cost          numeric DEFAULT 0,
  status              text    DEFAULT 'pending',   -- pending | approved | rejected
  reviewed_at         timestamptz,
  reviewed_by         text
);

-- ── STEP 4: Set Up Admin Account ──────────────────────────────
-- 1. Open AgriFusion Hub and Register with your Name & Phone number.
-- 2. Run the UPDATE statement below in Supabase SQL Editor:

-- UPDATE farmers
-- SET role = 'admin', is_verified = true
-- WHERE phone_number = 'YOUR_PHONE_HERE';

-- ============================================================
-- DONE! The app is ready.
-- ============================================================
