"use client";

import { useState } from "react";
import { AIRequestForm } from "../AIRequestForm";
import { AIResponseDisplay } from "../AIResponseDisplay/AIResponseDisplay";
import { CheckResults } from "@/types/formTypes";

export const AIServicePage = () => {
  const [checkResult, setCheckResults] = useState<{
    perplexityResponse: CheckResults[];
    chatGptResponse: CheckResults[];
  }>({
    perplexityResponse: [],
    chatGptResponse: [],
  });
  const [loading, setIsLoading] = useState(false);

  return (
    <div className="bg-black min-h-screen grid grid-cols-1 lg:grid-cols-5">
      <div className="lg:col-span-3 p-6">
         <div className="rounded-xl bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 shadow-lg p-10 h-full min-h-[300px] flex items-center justify-center text-white">
         <AIResponseDisplay checkResult={checkResult} loading={loading} />
        </div>
    </div>

      <div className="lg:col-span-2">
        <AIRequestForm
          setCheckResults={setCheckResults}
          setLoading={setIsLoading}
          loading={loading}
          checkResult={checkResult}
        />
      </div>
    </div>
  );
};
