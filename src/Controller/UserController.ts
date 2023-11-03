import { Request, Response } from "express";
import User, { IUser } from "../Model/User";

class UserController {
  static user: IUser;

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

  static async getAll() {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getById(userId) {
    try {
      const user = await User.findById(userId, "-password");

      if (!user) {
        throw "Usuário não encontrado.";
      }

      return user;
    } catch (error) {
      throw "Erro ao buscar o usuário.";
    }
  }
  static async put(userId, updatedUserData) {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
        new: true,
      });

      if (!updatedUser) {
        throw "Usuário não encontrado.";
      }

      return updatedUser;
    } catch (error) {
      throw "Erro ao atualizar o usuário.";
    }
  }
  static async delete(userId) {
    try {
      const deletedUser = await User.findByIdAndRemove(userId);

      if (!deletedUser) {
        throw "Usuário não encontrado.";
      }

      return deletedUser;
    } catch (error) {
      throw "Erro ao excluir o usuário.";
    }
  }
}

export default UserController;
