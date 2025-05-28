export const formatGenerationResponse = (
  checkRes: string
) => {
  const splittedByFolderStructure = checkRes.split('Suggestion on Real Project Folder Structure')
  const replacedCheckRes = splittedByFolderStructure[0].replace(
    /```(javascript|typescript|jsx|tsx)/g,
    "```"
  );

  const splittedByCode = replacedCheckRes.split("```");

  const codeMatches = Array.from(
    replacedCheckRes.matchAll(/```\s*([\s\S]*?)```/g)
  );
  
  return {
    chatGptResponse: {
        responseSplittedByCode: splittedByCode,
        codeParts: codeMatches.map(el => el[1]),
        folderStructure: `## Suggestion on Real Project Folder Structure\n\n${splittedByFolderStructure[1]}`,
    },
  }
};
