import { Request, Response } from 'express';
const express = require('express')


import User from '../Model/User'; // Importe o modelo de usuário e subdocumentos

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, password, dashboards } = req.body;
    const newUser = new User({ email, password, dashboards });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar o usuário.' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar usuários.' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar o usuário.' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar o usuário.' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndRemove(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json(deletedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao excluir o usuário.' });
  }
});

module.exports = router;
