import { CheckResults } from "@/types/formTypes";
import { sanitize } from "dompurify";
import { marked } from "marked";
import { Loader } from "../Loader";

export const AIResponseDisplay = ({
  checkResult,
  loading,
}: {
  checkResult: {
    perplexityResponse: CheckResults[];
    chatGptResponse: CheckResults[];
  };
  loading: boolean;
}) => {
  return (
    <div
      className={`text-white flex flex-col gap-8 ${
        loading ? "justify-center items-center" : ""
      }`}
    >
      {loading ? (
        <Loader />
      ) : null}
      {checkResult.perplexityResponse.length > 0 ? (
        <div className="p-6 bg-green-500/10 border border-green-300/30 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-4 border-b border-gray-600 pb-2">Perplexity</h1>
          {checkResult.perplexityResponse.map((el, index) => (
            <p
              key={index}
              className="prose prose-invert max-w-none mb-4"
              dangerouslySetInnerHTML={{
                __html: sanitize(marked.parse(el.content || "") as string).replace(/\s?\[\d+\]/g, ''),
              }}
            />
          ))}
        </div>
      ) : null}
      {checkResult.chatGptResponse.length > 0 ? (
         <div className="p-6 bg-green-500/10 border border-green-300/30 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-4 border-b border-gray-600 pb-2">ChatGPT</h1>
          {checkResult.chatGptResponse.map((el, index) => (
            <p
              key={index}
              className="prose prose-invert max-w-none mb-4"
              dangerouslySetInnerHTML={{
                __html: sanitize(marked.parse(el.content || "") as string).replace(/\s?\[\d+\]/g, ''),
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};
