export type ResponsePattern<DocType> = {
  status: string;
  results?: number;
  docs?: DocType[];
  doc?: DocType;
};
