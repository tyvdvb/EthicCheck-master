import { CheckResults, GenerateContentForm } from "@/types/formTypes";
import { ErrorMessage } from "@hookform/error-message";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { Button } from "../Button";
import { FormTextField } from "../FormTextField";
import { toast } from "react-toastify";
import axios from "axios";
import OpenAI from "openai";
import { Dispatch, SetStateAction, useMemo } from "react";
import countryList from "react-select-country-list";
import { formatGenerationResponse } from "@/utils/generationRequestResult";

interface IAIGenerationRequestFormProps {
  setLoading: (loading: boolean) => void;
  loading: boolean;
  setCheckResults: (checkResult: {
    chatGptResponse: {
      codeParts: string[];
      responseSplittedByCode: string[];
      folderStructure: string;
    },
    perplexityResponse?: string; 
  }) => void;
  setDataForFeedback: Dispatch<SetStateAction<{
    response: string;
    query: string;
    country: string;
}>>
}

export const AIGenerationRequestForm = ({
  loading,
  setLoading,
  setCheckResults,
  setDataForFeedback,
}: IAIGenerationRequestFormProps) => {
  const { handleSubmit, register, control, formState } =
    useForm<GenerateContentForm>();

  const onSubmit: SubmitHandler<GenerateContentForm> = async (
    formData: GenerateContentForm
  ) => {
    try {
      setCheckResults({
        chatGptResponse: {
          codeParts: [],
          responseSplittedByCode: [],
          folderStructure: '',
        },
        perplexityResponse: '',
      });
      setDataForFeedback({
        response: '',
        query: '',
        country: '',
      })
      setLoading(true);
      toast.info("Generation in progress, please wait a bit");
      const checkRequest = await axios.post<{
        chatGptResponse: OpenAI.Chat.Completions.ChatCompletion.Choice[];
        perplexityResponse: string;
      }>("api/generate-components", formData);

      
      const checkRes = checkRequest.data.chatGptResponse[0].message.content;

      if (!checkRes) {
        return;
      }

      setDataForFeedback({
        response: checkRes,
        country: formData.country.label,
        query: formData.requestContext,
      })
      setCheckResults({...formatGenerationResponse(checkRes), perplexityResponse: checkRequest.data.perplexityResponse});
      toast.success("Check successfully finished");
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const options = useMemo(() => countryList().getData(), []);

  return (
    <form
      className="w-2/4 flex flex-col gap-3 bg-neutral-800 p-10 rounded-xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="country"
        control={control}
        rules={{
          required: "This is required.",
        }}
        render={({ field }: { field: any }) => (
          <div className="flex items-center gap-3">
            <label htmlFor="country" className="block mb-2">
              Country
            </label>
            <Select
              isDisabled={loading}
              {...field}
              styles={{
                option: (styles) => ({ ...styles, color: "black" }),
                control: (styles) => ({ ...styles, minWidth: 300 }),
              }}
              options={options}
            />
            <ErrorMessage errors={formState.errors} name="country" />
          </div>
        )}
      />
      <FormTextField
        disabled={loading}
        className="w-full"
        validation={{ required: "This is required." }}
        name="requestContext"
        placeholder="Please provide a description of the content that you want to generate"
        register={register}
        errors={formState.errors}
      />
      <Button disabled={loading} type="submit">
        Generate
      </Button>
    </form>
  );
};
