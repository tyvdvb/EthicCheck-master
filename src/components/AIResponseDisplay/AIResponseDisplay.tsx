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
      className={`text-white flex flex-col ${
        loading ? "justify-center items-center" : ""
      }`}
    >
      {loading ? (
        <Loader />
      ) : null}
      {checkResult.perplexityResponse.length > 0 ? (
        <>
          <h1 className="text-3xl font-bold text-center">Perplexity</h1>
          {checkResult.perplexityResponse.map((el, index) => (
            <p
              key={index}
              dangerouslySetInnerHTML={{
                __html: sanitize(marked.parse(el.content || "") as string).replace(/\s?\[\d+\]/g, ''),
              }}
            />
          ))}
        </>
      ) : null}
      {checkResult.chatGptResponse.length > 0 ? (
        <>
          <h1 className="text-3xl font-bold text-center">ChatGPT</h1>
          {checkResult.chatGptResponse.map((el, index) => (
            <p
              key={index}
              dangerouslySetInnerHTML={{
                __html: sanitize(marked.parse(el.content || "") as string).replace(/\s?\[\d+\]/g, ''),
              }}
            />
          ))}
        </>
      ) : null}
    </div>
  );
};
