export type ResponseErrorBase = {
  name: string,
  type: string,
  message: string,
  [k: string]: any,
};

export class ResponseError extends Error {
  type!: string;
  message!: string;
  userMessage?: string;

  constructor(obj: ResponseErrorBase) {
    super();
    Object.assign(this, obj);
  }
}
