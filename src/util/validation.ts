import { Request, Response, NextFunction } from "express"
const jwt = require('jsonwebtoken')
const env = require('dotenv')


export function ExistOrError(valor, msg){
    if(!valor) throw msg
}

export function EqualsOrErro(valor1,valor2, msg){
    if(valor1 !== valor2) throw msg
}

export function checkToken(req: Request, res: Response, Next: NextFunction){

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if(!token){
        return res.status(401).json({msg: "Acesso Negado"})
    }

    try {
        const secret = process.env.SECRET

        jwt.verify(token, secret)
        Next()
    } catch (error) {
        res.status(400).json({msg: "Token inválido"})
    }

}

//export default ExistOrError

/*module.exports = {
    ExistOrError,
    checkToken,
    EqualsOrErro
}*/