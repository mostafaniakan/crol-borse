type RouteContext = { params: Promise<{ symbol: string; metric: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { symbol, metric } = await context.params;
  return Response.json(
    {
      ok: false,
      code: "CALCULATION_TRACE_NOT_CONFIGURED",
      symbol,
      metric,
      message: "داده معتبر و Calculation Trace برای این نماد و شاخص ثبت نشده است.",
    },
    { status: 503 },
  );
}
