import connectDB from "@/db/database";
import { generateComponentFromGPT } from "@/services/analyze-services/chatGPTRequestsService";
import { sendAnalizeRequestToPerplexity } from "@/services/analyze-services/perplexityAnalyzeService";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
 try { const data = await req.json();
  await connectDB();  
  const perplexityResponse = await sendAnalizeRequestToPerplexity(data);

  const chatGptResponse = await generateComponentFromGPT({
    data,
    perplexityResponse, 
  });

  return NextResponse.json({
    chatGptResponse,
    perplexityResponse,
  });
} catch (e){
  return NextResponse.json({
    error: e
  })
}
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
