export async function GET() {
  return Response.json(
    {
      ok: false,
      code: "DATA_SOURCE_NOT_CONFIGURED",
      message:
        "منبع داده بازار برای اسکن کامل پیکربندی نشده است. تا اتصال معتبر TSETMC/Codal برقرار نشود، رتبه‌بندی منتشر نمی‌شود.",
    },
    { status: 501 },
  );
}
