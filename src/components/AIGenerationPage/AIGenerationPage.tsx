"use client";

import { useEffect, useState } from "react";
import { sanitize } from "dompurify";
import { marked } from "marked";
import { Accordion, AccordionItem as Item } from '@szhsin/react-accordion';
import { AIGenerationRequestForm } from "../AIGenerationRequestForm/AIGenerationRequestForm";
import { Loader } from "../Loader";
import { AIGenerationDisplay } from "../AIGenerationDisplay/AIGenerationDisplay";
import styles from "./style.module.css";
import '../AIGenerationDisplay/style.scss'
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const AccordionItem = ({ header, ...rest }: any) => (
  <Item
    {...rest}
    header={
      <>
        {header}
        <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.chevron} icon icon-tabler icon-tabler-chevron-down`} width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <polyline points="6 9 12 15 18 9" />
</svg>
      </>
    }
    className={styles.item}
    buttonProps={{
      className: ({ isEnter }) =>
        `${styles.itemBtn} ${isEnter && styles.itemBtnExpanded}`,
    }}
    contentProps={{ className: styles.itemContent }}
    panelProps={{ className: styles.itemPanel }}
  />
);

export const AIGenerationPage = () => {
  const [checkResult, setCheckResults] = useState<{
    chatGptResponse: {
      codeParts: string[];
      responseSplittedByCode: string[];
      folderStructure: string;
    };
    perplexityResponse?: string;
  }>({
    chatGptResponse: {
      codeParts: [],
      responseSplittedByCode: [],
      folderStructure: '',
    },
    perplexityResponse: '',
  });
  const [loading, setIsLoading] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [dataForFeedback, setDataForFeedback] = useState<{
    response: string,
    query: string,
    country: string,
  }>({
    response: '',
    query: '',
    country: '',
  })

  const onSendFeedback = async (relates: boolean) => {
    await axios.post('/api/feedback', {
      relates,
      ...dataForFeedback
    })
    setFeedbackSent(true)
    toast.success('Thank you for your feedback!');
  }

  useEffect(() => {
    setFeedbackSent(false)
  }, [checkResult.chatGptResponse.folderStructure])

  const responseNotExists = checkResult.chatGptResponse.responseSplittedByCode?.length === 0;
  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-[calc(100vh-100px)] flex flex-col items-center p-8 gap-8 text-white">
      <h1 className="text-4xl font-bold text-center"> AI Component Generation </h1>
      
      <div
        className={`${
           checkResult.chatGptResponse.codeParts.length > 0
            ? "flex-1"
            : "h-[300px]"
          } w-full max-w-5xl overflow-y-auto rounded-xl bg-gray-900 border border-gray-700 shadow-md transition-all duration-300 p-10`}>

        <div
          className={`text-white flex flex-col ${
            loading ? "justify-center items-center py-10" : ""
          }`}
        >
          {loading ? <Loader /> : null}
        </div>
        { responseNotExists && !loading ? (
        <p className="text-center text-gray-400 leading-relaxed">
          <b>Welcome to the AI Component Generator! 🌍✨</b><br />
          To get started, scroll down and fill in the form with the following details:
          <br />
          <strong>1. Country or Region</strong> – This helps us adapt the design to cultural norms, language, and local preferences.<br />
          <strong>2. Component Type</strong> – Specify UI element you would like to generate, like a navigation menu, form, or footer.<br />
          <strong>3. Preferences</strong> – You can add any style or functionality you would like.
          <br /><br />
          Once you submit the form, our system will analyze your input, gather regional insights, and generate a culturally tailored component with ready-to-use code and design explanations.
        </p>
      ) : null}
        <AIGenerationDisplay checkResult={checkResult} />
        {feedbackSent || responseNotExists ? null : <div className="flex justify-end gap-5">
          <span onClick={()=> onSendFeedback(true)} className="flex gap-2 rounded-xl border p-2 border-white cursor-pointer"><ThumbsUpIcon /> Relates </span>
          <span onClick={()=> onSendFeedback(false)} className="flex gap-2 rounded-xl border p-2 border-white cursor-pointer"><ThumbsDownIcon /> Not relates</span> 
        </div> }
      </div>
      {responseNotExists ? null : <div className={`${styles.accordion} acc-design`}>
      <Accordion  transition transitionTimeout={250}>
      <AccordionItem header="Design helper">
      <div className="animate-fade-in">
      <div className={ `${styles.perplexityContent} bg-green-100/10 border border-green-300/30 rounded-2xl p-5 text-base leading-relaxed text-white shadow-inner backdrop-blur-sm`}>
        <div dangerouslySetInnerHTML={{
          __html: sanitize(
            marked.parse(
              (checkResult?.perplexityResponse || '').replace(/\s?\[\d+\]/g, '')
            ) as string
          )}}
          />
      </div>
      </div>

      </AccordionItem>
    </Accordion>
    </div>}
      <AIGenerationRequestForm
        loading={loading}
        setCheckResults={setCheckResults}
        setLoading={setIsLoading}
        setDataForFeedback={setDataForFeedback}
      />
    </div>
  );
};
