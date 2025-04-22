import connectDB from "@/db/database";
import { requestPerplexityAndChatGpt } from "@/check-services/aiRequestsService";
import { sendRequestToPerplexity } from "@/analyze-services/perplexityAnalyzeService";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  await connectDB();
  const { perplexityResponse, chatGptResponse } = await requestPerplexityAndChatGpt(data);

  return NextResponse.json({
    perplexityResponse,
    chatGptResponse,
  });
}

export async function GET() {
  try {
    const user = await currentUser();

    return NextResponse.json({
      message: user,
    });
  } catch {
    return NextResponse.json({
      message: "fail",
    });
  }
}
