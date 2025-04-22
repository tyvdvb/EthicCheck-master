import { EthicForm } from "@/types/formTypes";
import { constructRequestToAI } from "@/utils/constructRequestToAI";
import OpenAI from "openai";

export const sendRequestToPerplexity = async (body: EthicForm) => {

  const requestString = `
  You are a research assistant. Provide a cultural and UX/UI design summary for websites in ${body.country.label}.
  
  Focus on:
  - Common layout patterns
  - Color symbolism and visual preferences
  - Language and content structure
  - Usability norms (e.g. navigation, mobile use)
  - Imagery and symbolism
  
  This info is for analyzing: ${body.url}
  Preferred language: ${body.language}
  
  Return ONLY a factual summary. Another AI will handle component generation.
  `;


  // const requestString = constructRequestToAI(body.url, body.country.label, {
  //   localization: body.localization,
  //   language: body.language,
  //   colorsAndSymbolism: body.colorsAndSymbolism,
  //   contentAndImagery: body.contentAndImagery,
  //   usability: body.usability,
  // });

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

  // return aiResponse.choices;

  const context = aiResponse.choices[0]?.message?.content || "No context available.";
  console.log("Extracted Context: ", context);
  return context; 
};
