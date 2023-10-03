import { Request, Response } from "express";
import User from "../Model/User";

class UserController {
  static async post(req: Request, res: Response) {
    try {
      const clone = { ...req.body };
      const newUser = new User(clone);
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar o usuário." });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar usuários." });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId, "-password");
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar o usuário." });
    }
  }
  static async put(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const updatedUserData = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updatedUserData,
        {
          new: true,
        }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar o usuário." });
    }
  }
  static async delete(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const deletedUser = await User.findByIdAndRemove(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }
      res.json(deletedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao excluir o usuário." });
    }
  }
}

export default UserController;
