import { CheckParams } from "./formTypes";

export interface RequestHistory {
  email: string;
  siteUrl: string;
  country: string;
  requestParams: CheckParams;
  perplexityResponse: {
    content: String;
  }[];
  chatGptResponse: {
    content: String;
  }[];
}
