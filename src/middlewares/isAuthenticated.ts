import { NextFunction, Request, Response } from "express";
import { NO_CURRENT_USER_AUTHENTICATED } from "../constants/responseErrors";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.authenticated) {
    res.handleError(NO_CURRENT_USER_AUTHENTICATED);
    return;
  }

  next();
};

export default isAuthenticated;
