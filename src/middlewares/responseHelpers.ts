import { NextFunction, Request, Response } from "express";
import { UNKNOWN_ERROR } from "../constants/responseErrors";
import { ResponseError } from "../utils/ResponseError";

const responseHelpers = (req: Request, res: Response, next: NextFunction) => {
  res.sendData = (data, statusCode) => {
    res.status(statusCode ?? 200).json({ data });
  }

  res.sendErrors = (errors, statusCode) => {
    res.status(statusCode ?? 400).json({ errors });
  }

  res.handleError = (error: ResponseError[] | ResponseError | Error) => {
    if (error instanceof ResponseError) {
      console.error(error);
      res.sendErrors([error]);
    } else if (Array.isArray(error)) {
      console.error(`${error.length} errors:\n`);
      error.forEach((error) => console.error(error));
      res.sendErrors(error);
    } else {
      console.error("Unknown error:\n", error);
      res.sendErrors([UNKNOWN_ERROR]);
    }
  }

  next();
}

export default responseHelpers;
