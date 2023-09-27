import User from "../model/User";
import {Request, Response} from 'express'
import { ExistOrError } from "../util/validation";
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class AuthController{
    
    static async signup(req: Request, res: Response){
        try {
            const clone = {...req.body};
            const newUser = new User(clone);
            const savedUser = await newUser.save();
            res.status(201).json(savedUser);


          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao criar o usuário.' });
          }

    }

    static async signin(req: Request, res: Response){
        const {email, password} = req.body

    ExistOrError(email, "Email é obrigatório")
    ExistOrError(password, "Senha é obrigatória")

    const user = await User.findOne({email: email})

    ExistOrError(user, "Usuário não encontrado")

    const checkPassword = await bcrypt.compare(password, user.password)
    ExistOrError(checkPassword, "Senha ou email não encontrados")


    try {
        const secret = process.env.SECRET

        const token = jwt.sign({
            id: user.id
        }, secret)

        res.status(200).json({msg: "sucesso", token})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Ocorreu um erro"})
    }
    }
}

export default AuthController