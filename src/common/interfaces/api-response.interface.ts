export type ResponseError = {
  message?: string | string[];
  statusCode?: number;
  error?: string;
};

export type ResponseFormat<T> = {
  data: T;
} & ResponseError;
