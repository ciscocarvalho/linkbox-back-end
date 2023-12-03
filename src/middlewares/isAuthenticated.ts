import { NextFunction, Request, Response } from "express";
import { USER_NOT_AUTHENTICATED } from "../constants/responseErrors";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.authenticated) {
    res.handleError(USER_NOT_AUTHENTICATED);
    return;
  }

  next();
};

export default isAuthenticated;
