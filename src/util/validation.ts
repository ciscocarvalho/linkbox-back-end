import { Request, Response, NextFunction } from "express"
const jwt = require('jsonwebtoken')
const env = require('dotenv')

export function checkToken(req: Request, res: Response, Next: NextFunction){

    const token = req.cookies.token;

  if (!token) {
    return res.status(403).send('Token não fornecido.');
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send('Token inválido.');
    }
    
    Next();
    })

}