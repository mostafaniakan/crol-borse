export async function POST() {
  return Response.json(
    {
      ok: false,
      code: "JOB_STORE_NOT_CONFIGURED",
      message: "ذخیره‌سازی پایدار Job هنوز پیکربندی نشده است؛ عملیات جعلی ایجاد نشد.",
    },
    { status: 501 },
  );
}

export async function GET() {
  return Response.json({
    ok: true,
    jobs: [],
    status: "NOT_CONFIGURED",
    message: "برای نمایش Jobها باید storage پایدار و worker اجرای تحلیل متصل شود.",
  });
}
