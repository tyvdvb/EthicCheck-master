import { EthicForm } from "@/types/formTypes";
import { sendRequestToPerplexity } from "./perplexityService";
import { saveNewRequestToUserHistory } from "@/repository/userRequestsHistory";
import { sendRequestToChatGpt } from "./chatGPTService";

export const requestPerplexityAndChatGpt = async (data: EthicForm) => {
  const [perplexityResponse, chatGptResponse] = await Promise.all([
    sendRequestToPerplexity(data),
    sendRequestToChatGpt(data),
  ]); // add chat gpt request here
  saveNewRequestToUserHistory(
    data.url,
    data.country.label,
    {
      colorsAndSymbolism: data.colorsAndSymbolism,
      contentAndImagery: data.colorsAndSymbolism,
      language: data.language,
      usability: data.usability,
      localization: data.localization,
    },
    chatGptResponse.reduce<{ content: string }[]>((acc, curr) => {
      acc.push({ content: curr.message.content || "" });
      return acc;
    }, []),
    perplexityResponse.reduce<{ content: string }[]>((acc, curr) => {
      acc.push({ content: curr.message.content || "" });
      return acc;
    }, [])
  );
  return {
    perplexityResponse,
    chatGptResponse,
  };
};
