declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    FRED_API_KEY?: string;
    TRADING_ECONOMICS_API_KEY?: string;
  }
}
