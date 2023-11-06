import { NextFunction, Request, Response } from "express";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.authenticated) {
    res.status(404).json({ msg: "No current user authenticated" });
    return;
  }

  next();
};

export default isAuthenticated;
