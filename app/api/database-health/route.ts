import { sql } from "drizzle-orm";
import { getDb } from "../../../db";

export async function GET() {
  try {
    const db = getDb();
    await db.run(sql`SELECT 1`);

    return Response.json({
      ok: true,
      checkedAt: new Date().toISOString(),
    });
  } catch {
    return Response.json(
      {
        ok: false,
        code: "DATABASE_UNAVAILABLE",
        message: "اتصال به دیتابیس برقرار نیست.",
      },
      { status: 503 },
    );
  }
}
