import { Request, Response } from 'express';
const express = require('express')


import Link from '../model/Link';

const router = express.Router();


router.post('/', async (req: Request, res: Response) => {
    try {
      const clone = { ...req.body };
      const newLink = new Link(clone);
      const savedLink = await newLink.save();
      res.status(201).json(savedLink);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao criar o link.' });
    }
  });

  router.get('/', async (req: Request, res: Response) => {
    try {
      const links = await Link.find();
      res.json(links);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar links.' });
    }
  });


  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const LinkId = req.params.id;
      const link = await Link.findById(LinkId);
      if (!link) {
        return res.status(404).json({ message: 'Link não encontrado.' });
      }
      res.json(link);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar o link' });
    }
  });


  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const linkId = req.params.id;
      const updatedLinkData = req.body;
      const updatedLink = await Link.findByIdAndUpdate(linkId, updatedLinkData, {
        new: true,
      });
      if (!updatedLink) {
        return res.status(404).json({ message: 'Link não encontrado.' });
      }
      res.json(updatedLink);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar o Link.' });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const linkId = req.params.id;
      const deletedLink = await Link.findByIdAndRemove(linkId);
      if (!deletedLink) {
        return res.status(404).json({ message: 'Link não encontrado.' });
      }
      res.json(deletedLink);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao excluir o link.' });
    }
  });


  module.exports = router