import { GenerateContentForm } from "@/types/formTypes";
import OpenAI from "openai";
import fs from 'fs';
import { saveNewRequestToUserHistory } from "@/repository/userRequestsHistory";

export async function generateComponentFromGPT({
  data,
  perplexityResponse,
}: {
  data: GenerateContentForm;
  perplexityResponse: string;
}) {


  const countryName = data.country.label;
  const culturalRules = JSON.parse(fs.readFileSync('./src/data/culturalRules.json', 'utf8'));
  const regionMapper = JSON.parse(fs.readFileSync('./src/data/regionMapper.json', 'utf8'));
  const designPatterns = JSON.parse(fs.readFileSync('./src/data/design_patterns.json', 'utf8'));

  const currentCountryRegion = regionMapper[countryName];
  let currentCountryCulturalRules = culturalRules[countryName];
  let currentCountryDesignPatterns = designPatterns[countryName];
  if(!currentCountryCulturalRules) {
    currentCountryCulturalRules = culturalRules[currentCountryRegion];
  }
  if(!currentCountryDesignPatterns) {
    currentCountryDesignPatterns = designPatterns[currentCountryRegion];
  }

  

  const prompt = `You are the experienced frontend developer with excellent knowledge in Frontend development and UI/UX. Based on the following UI/UX context for ${data.country}:
\"\"\"
${perplexityResponse}
\"\"\"
Generate modern React components with inline styles for styling according to following description  ${data.requestContext}. Provide two files with different designs.

List of requirements to generated content:
- Styles should be inline
- Necessarily import i18next function fom react-i18next and use it to initialize translations. So it would not give an import error
- make sure to initialize translations correctly
- use useTranslation hook to get t function in component where needed. 
- generate translation object with english and language used locally in the specified country
- mock all needed data, for images you can use some dummy image url -> https://lh5.googleusercontent.com/proxy/t08n2HuxPfw8OpbutGWjekHAgxfPFv-pZZ5_-uTfhEGK8B5Lp-VN4VjrdxKtr8acgJA93S14m9NdELzjafFfy13b68pQ7zzDiAmn4Xg8LvsTw1jogn_7wStYeOx7ojx5h63Gliw. So generated components looks real
- Each variant should be independent each in one file and only one export default should be used.
- The design should follow structure and visual according to modern trends on widely used websites
- Pay extra attention to sizes and alignment of the items an use semantic tags where needed.
- Use this websites as hints for design patterns ${currentCountryDesignPatterns}
- Use this as a hint for country cultural rules ${currentCountryCulturalRules}


Also provide a suggestion on best folder structure in real project for generated components.

Structure your response in the following way, each point should be a separate paragraph with corresponding header:
- General description of what was done
- Generated code
- Explenation of what was done for cultural alignment with provided country
- Suggestion on real project folder structure (please highlight suggested folder structure with ???? at both ends)

Make sure that code is running in sandpack with react template. 
For text use Github markdown.

`;
  const chatCPTClient = new OpenAI({
    apiKey: process.env.CHAT_GPT_SECRET,
  });

  const aiResponse = await chatCPTClient.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  saveNewRequestToUserHistory(
    '',
    data.country.label,
    undefined,
    aiResponse.choices.reduce<{ content: string }[]>((acc, curr) => {
      acc.push({ content: curr.message.content || "" });
      return acc;
    }, []),
  );

  return aiResponse.choices;
}
