-- PostgreSQL model for Radar Sahm.
-- Keep raw source data separate from the normalized analysis layer.
CREATE TABLE IF NOT EXISTS company_map (
  id BIGSERIAL PRIMARY KEY,
  company_name TEXT NOT NULL,
  ticker TEXT NOT NULL,
  isin TEXT UNIQUE,
  industry TEXT,
  mapping_confidence NUMERIC(5,2) DEFAULT 0,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS market_sales_monthly (
  id BIGSERIAL PRIMARY KEY,
  company_map_id BIGINT REFERENCES company_map(id),
  brand_id INTEGER,
  brand_name TEXT,
  category_id INTEGER,
  category_name TEXT,
  month DATE NOT NULL,
  gross_sales NUMERIC(20,2) DEFAULT 0,
  returns NUMERIC(20,2) DEFAULT 0,
  net_sales NUMERIC(20,2) DEFAULT 0,
  quantity NUMERIC(20,4) DEFAULT 0,
  weight NUMERIC(20,4) DEFAULT 0,
  active_stores INTEGER DEFAULT 0,
  active_cities INTEGER DEFAULT 0,
  data_coverage_score NUMERIC(5,2) DEFAULT 0,
  UNIQUE (company_map_id, brand_id, category_id, month)
);

CREATE TABLE IF NOT EXISTS financial_snapshot (
  id BIGSERIAL PRIMARY KEY,
  company_map_id BIGINT NOT NULL REFERENCES company_map(id),
  period_end DATE NOT NULL,
  revenue NUMERIC(20,2),
  gross_profit NUMERIC(20,2),
  operating_profit NUMERIC(20,2),
  net_profit NUMERIC(20,2),
  operating_cash_flow NUMERIC(20,2),
  total_debt NUMERIC(20,2),
  inventory NUMERIC(20,2),
  receivables NUMERIC(20,2),
  source TEXT NOT NULL DEFAULT 'codal',
  UNIQUE (company_map_id, period_end)
);

CREATE TABLE IF NOT EXISTS market_snapshot (
  id BIGSERIAL PRIMARY KEY,
  company_map_id BIGINT NOT NULL REFERENCES company_map(id),
  as_of DATE NOT NULL,
  close_price NUMERIC(20,4),
  market_cap NUMERIC(24,2),
  eps NUMERIC(20,4),
  pe NUMERIC(20,4),
  float_percent NUMERIC(7,3),
  traded_value NUMERIC(24,2),
  traded_volume NUMERIC(24,2),
  average_volume_30d NUMERIC(24,2),
  source TEXT NOT NULL DEFAULT 'tsetmc',
  UNIQUE (company_map_id, as_of)
);

CREATE INDEX IF NOT EXISTS sales_month_idx ON market_sales_monthly(month);
CREATE INDEX IF NOT EXISTS company_ticker_idx ON company_map(ticker);
CREATE INDEX IF NOT EXISTS financial_period_idx ON financial_snapshot(period_end);
CREATE INDEX IF NOT EXISTS market_asof_idx ON market_snapshot(as_of);
