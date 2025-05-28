import { EthicForm } from "@/types/formTypes";
import { constructRequestToAI } from "@/utils/constructRequestToAI";
import OpenAI from "openai";

export const sendRequestToPerplexity = async (body: EthicForm) => {
  const requestString = constructRequestToAI(body.url, body.country.label, {
    localization: body.localization,
    language: body.language,
    colorsAndSymbolism: body.colorsAndSymbolism,
    contentAndImagery: body.contentAndImagery,
    usability: body.usability,
  });

  const perplexityClient = new OpenAI({
    baseURL: "https://api.perplexity.ai",
    apiKey: process.env.PERPLEXITY_API_KEY,
  });

  const aiResponse = await perplexityClient.chat.completions.create({
    model: "sonar",
    messages: [
      {
        role: "user",
        content: requestString,
      },
    ],
  });

  return aiResponse.choices;
};
