import { EthicForm } from "@/types/formTypes";
import { sendRequestToPerplexity } from "./perplexityAnalyzeService";

import { constructRequestToAI } from "@/utils/constructRequestToAI";
import OpenAI from "openai";

export const sendRequestToChatGpt = async (body: EthicForm) => {

  const context = (await sendRequestToPerplexity(body));

  const { additionalContext: _, ...checkParams } = body;

  const requestString = constructRequestToAI(
    body.url,
    body.country.label,
    checkParams,
    context
  );

  const perplexityClient = new OpenAI({
    apiKey: process.env.CHAT_GPT_SECRET,
  });

  const aiResponse = await perplexityClient.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: requestString,
      },
    ],
  });
  return aiResponse.choices;
};
