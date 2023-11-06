import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const session = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    req.session = {
      authenticated: false,
    };

    next();
    return;
  }

  jwt.verify(token, process.env.SECRET!, (_: any, decoded: any) => {
    req.session = {
      authenticated: true,
      userId: decoded?.id,
    };

    next();
  });
}

export default session;
