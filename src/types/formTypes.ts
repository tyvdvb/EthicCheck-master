export interface CheckParams {
  language: boolean;
  colorsAndSymbolism: boolean;
  usability: boolean;
  contentAndImagery: boolean;
  localization: boolean;
  additionalContext?: string; 
}

export interface EthicForm extends CheckParams {
  url: string;
  country: {
    label: string;
    value: string;
  };
}

export interface CheckResults {
  content: string
}