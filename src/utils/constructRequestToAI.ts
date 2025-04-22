import { CheckParams } from "@/types/formTypes";


const AI_REQUEST_PROPERTY_BY_PARAMETER: Record<keyof Omit<CheckParams, "additionalContext">, string> = {
  language: "language",
  colorsAndSymbolism: "colors and symbolism",
  usability: "usability",
  contentAndImagery: "content and imagery",
  localization: "localization",
};

// const AI_REQUEST_PROPERTY_BY_PARAMETER: Record<keyof CheckParams, string> = {
//   language: "language",
//   colorsAndSymbolism: "colors and symbolism",
//   usability: "usability",
//   contentAndImagery: "content and imagery",
//   localization: "localization",


// };

// export const constructRequestToAI = (
//   url: string,
//   country: string,
//   checkParameters: CheckParams
// ) => {
//   const baseRequestString = `Please, check the website URL ${url} for each of such cultural requirements as`;
//   const endOfRequestString = `for use in ${country}. If needed advise on what to fix up for each requirement`
//   const requestStringWithParameters = (Object.entries(checkParameters) as Array<[keyof CheckParams, boolean]>).reduce(
//     (acc, [key, value]) => {
//       if (value) {
//         return `${acc} ${AI_REQUEST_PROPERTY_BY_PARAMETER[key]},`;
//       }
//       return acc;
//     },
//     baseRequestString
//   );
//   return `${requestStringWithParameters} ${endOfRequestString}`
// };

export const constructRequestToAI = (
  url: string,
  country: string,
  checkParameters: Omit<CheckParams, "additionalContext">,
  additionalContext?: string
) => {
  const baseRequest = `You are a UI/UX component generator. Generate culturally adapted components for the website ${url}, considering the following design concerns:`;

  const parameterList = (Object.entries(checkParameters) as Array<[keyof typeof checkParameters, boolean]>)
    .filter(([_, value]) => value)
    .map(([key]) => AI_REQUEST_PROPERTY_BY_PARAMETER[key])
    .join(", ");

  const contextBlock = additionalContext
    ? `\n\nContext based on cultural/UX research for ${country}:\n${additionalContext}`
    : "";

  return `${baseRequest} ${parameterList} for users in ${country}.${contextBlock}

Please:
- Generate HTML/React components (Tailwind preferred)
- Localize any content (language = ${checkParameters.language})
- Explain why your design fits the culture/region
- Include notes on layout, colors, icons, imagery, text, etc.
`;
};