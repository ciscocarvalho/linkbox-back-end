import { Request, Response } from 'express';

const express = require('express')
import Dashboard from '../model/Dashboard';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    try {
      const clone = {... req.body };
      const newDashboard = new Dashboard(clone);
      const savedDashboard = await newDashboard.save();
      res.status(201).json(savedDashboard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao criar a dashboard.' });
    }
  });

  router.get('/', async (req: Request, res: Response) => {
    try {
      const dashboard = await Dashboard.find();
      res.json(dashboard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar a dashboard.' });
    }
  });


  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const dashboardId = req.params.id;
      const dashboard = await Dashboard.findById(dashboardId);
      if (!dashboard) {
        return res.status(404).json({ message: 'Dashboard não encontrada.' });
      }
      res.json(dashboard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar a pasta' });
    }
  });


  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const dashboardId = req.params.id;
      const updatedDashboardData = req.body;
      const updatedDashboard = await Dashboard.findByIdAndUpdate(dashboardId, updatedDashboardData, {
        new: true,
      });
      if (!updatedDashboard) {
        return res.status(404).json({ message: 'Dashboard não encontrada.' });
      }
      res.json(updatedDashboard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar a dashboard.' });
    }
  });




  router.put('/dashboards/:dashboardId/links/:linkId', async (req, res) => {
    const dashboardId = req.params.dashboardId;
    const linkId = req.params.linkId;
    const updatedLinkData = req.body;
  
    try {
      

      const dashboard = await Dashboard.findById(dashboardId);


      if (!dashboard) {
        return res.status(404).json({ message: 'Dashboard não encontrado.' });
      }

      const linkToUpdate = dashboard.link.find(link => link._id.equals(linkId));
      // Verifique se o link foi encontrado
      if (!linkToUpdate) {
        return res.status(404).json({ message: 'Link não encontrado.' });
      }
  
      // Atualize os dados do subdocumento link
      linkToUpdate.set(updatedLinkData);
  
      // Salve o dashboard atualizado no banco de dados
      await dashboard.save();
  
      // Responda com o dashboard atualizado
      res.json(dashboard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar o subdocumento link.' });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const dashboardId = req.params.id;
      const deletedDashboard = await Dashboard.findByIdAndRemove(dashboardId);
      if (!deletedDashboard) {
        return res.status(404).json({ message: 'Dashboard não encontrada.' });
      }
      res.json(deletedDashboard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao excluir a pasta.' });
    }
  });

module.exports = router