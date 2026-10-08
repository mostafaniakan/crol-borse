import { KNOWLEDGE_BASE_VERSION, LEARNING_TERMS } from "../../../../lib/learning/knowledge-base";

export async function GET() {
  return Response.json({
    version: KNOWLEDGE_BASE_VERSION,
    terms: LEARNING_TERMS,
    generatedAt: new Date().toISOString(),
  });
}
