import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { SECRET } from "../constants";

const session = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    req.session = {
      authenticated: false,
    };

    next();
    return;
  }

  jwt.verify(token, SECRET, async (_: any, decoded: any) => {
    const userId = decoded?.id;
    const user = await User.findById(userId);

    if (user) {
      req.session = { authenticated: true, userId, user };
    } else {
      req.session = { authenticated: false };
    }

    next();
  });
}

export default session;
