export interface CheckParams {
  language: boolean;
  colorsAndSymbolism: boolean;
  usability: boolean;
  contentAndImagery: boolean;
  localization: boolean;
}

export interface Country {
    label: string;
    value: string;
}

export interface EthicForm extends CheckParams {
  url: string;
  country: Country;
}

export interface CheckResults {
  content: string
}


export interface GenerateContentForm {
  country: Country;
  requestContext: string;
}