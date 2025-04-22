import connectDB from "@/db/database";
import { requestAnalysisFromChatGPT } from "@/analyze-services/chatGPTRequestsService";
import { sendRequestToPerplexity } from "@/analyze-services/perplexityAnalyzeService";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  await connectDB();

  const perplexityResponse = await sendRequestToPerplexity(data);
  // const { perplexityResponse, chatGptResponse } = await requestPerplexityAndChatGpt(data);

  // return NextResponse.json({
  //   perplexityResponse,
  //   chatGptResponse,
  // });

  const chatGptResponse = await requestAnalysisFromChatGPT({
    ...data,
    perplexityResponse, 
  });
  return NextResponse.json({
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
