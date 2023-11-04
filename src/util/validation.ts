import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

class Validations {
  static checkToken(req: Request, res: Response, Next: NextFunction) {
    const token = req.cookies.token;

    if (!token) {
      return res.status(403).send("Token is required");
    }

    jwt.verify(token, process.env.SECRET, (err: jwt.VerifyErrors) => {
      if (err) {
        return res.status(401).send("Invalid token");
      }

      Next();
    });
  }
}

export default Validations;
