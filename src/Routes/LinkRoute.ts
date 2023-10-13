import express from 'express'
import { Request, Response } from 'express';

import LinkController from '../Controller/LinkController';
import { ILink } from '../Model/Link';

const router = express.Router();


  router.post('/:userId/:dashboardId', async (req: Request, res:Response)=>{
    try {
      const userId = req.params.userId;
      const dashboardId = req.params.dashboardId;
      const linkData: ILink = { ...req.body };
      const l = await LinkController.post(userId,dashboardId,linkData)
      res.status(200).json(l)
    } catch (error) {
      res.status(400).json({msg : error})
    }
  })

  router.get('/:userId/:dashboardId', async (req: Request, res:Response)=>{
    try {
      const userId = req.params.userId;
      const dashboardId = req.params.dashboardId;
      const l = await LinkController.getAllInDashboard(userId, dashboardId)
      res.status(200).json(l)
    } catch (error) {
      res.status(400).json(error)
    }
  });

  router.put('/:userId/:dashboardId/:linkId', async (req: Request, res:Response)=>{

      try {
        const userId = req.params.userId;
        const dashboardId = req.params.dashboardId;
        const linkId = req.params.linkId;
        const updatedLinkData = req.body;
        const l = await LinkController.put(userId, dashboardId, linkId, updatedLinkData)
      res.status(200).json(l)
      } catch (error) {
        res.status(200).json(error)
      }
  });

  router.delete('/:userId/:dashboardId/:linkId',async (req: Request, res:Response)=>{

      try {
        const userId = req.params.userId;
        const dashboardId = req.params.dashboardId;
        const linkId = req.params.linkId;
        const l = LinkController.delete(userId, dashboardId, linkId)
        res.status(200).json(l)
      } catch (error) {
        res.status(400).json(error)
      }

  });


  export default router