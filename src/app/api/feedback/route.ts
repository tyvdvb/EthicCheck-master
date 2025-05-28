import connectDB from "@/db/database";
import UserFeedback from "@/models/UserFeedback";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  await connectDB();
  const newFeedback = new UserFeedback({
    response: data.response,
    relates: data.relates,
    query: data.query,
    country: data.country,
  });

  await newFeedback.save();
  return NextResponse.json({ success: 'true' });

}
