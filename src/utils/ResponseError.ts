export type ResponseErrorBase = {
  type: string,
  message: string,
  userMessage: string,
  [k: string]: any,
};

export class ResponseError extends Error {
  type!: string;
  message!: string;
  userMessage!: string;

  constructor(obj: ResponseErrorBase) {
    super();
    Object.assign(this, obj);
  }
}
