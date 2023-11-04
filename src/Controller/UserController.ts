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
    const users = await User.find();
    return users;
  }

  static async getById(userId: string) {
    const user = await User.findById(userId, "-password");

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    return user;
  }
  static async put(userId: string, updatedUserData: IUser) {
    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    });

    if (!updatedUser) {
      throw new Error("Usuário não encontrado.");
    }

    return updatedUser;
  }
  static async delete(userId: string) {
    const deletedUser = await User.findByIdAndRemove(userId);

    if (!deletedUser) {
      throw new Error("Usuário não encontrado.");
    }

    return deletedUser;
  }
}

export default UserController;
