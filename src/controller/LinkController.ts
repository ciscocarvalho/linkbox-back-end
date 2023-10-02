import {Response, Request} from 'express'
import Link from '../Model/Link';
import User from '../Model/User';

class LinkController{
   
    static async post(req: Request, res: Response){

        try {
            const clone = { ...req.body };
            const newLink = new Link(clone);
            const savedLink = await newLink.save();
            res.status(201).json(savedLink);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao criar o link.' });
          }

    }
    static async getAllInDashboard(req: Request, res: Response){

      try {
        const userId = req.params.userId
        const dashboardId = req.params.dashboardId
        const user = await User.findById(userId)
        
        if(!user){
          res.status(500).json('usuário não encontrado')
        }

        const dashboard = user.dashboards.find((d) => d._id.toString() === dashboardId);

        if (!dashboard) {
          return res.status(404).json({ error: 'Dashboard não encontrada' });
        }
        const links = dashboard.link

          res.json(links);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Erro ao buscar a pasta.' });
        }

    }

    static async put(req: Request, res: Response){

      try {
        const userId = req.params.userId
        const dashboardId = req.params.dashboardId
        const linkId = req.params.id;
        const updatedLinkData = req.body;

        const user = await User.findById(userId)
      
        if(!user){
          res.status(500).json('usuário não encontrado')
        }

        const dashboard = user.dashboards.find((d) => d._id.toString() === dashboardId);

        if (!dashboard) {
          return res.status(404).json({ error: 'Dashboard não encontrada' });
        }

        const linkIndex = dashboard.folder.find((f) => f._id.toString() === linkId);


        if (!linkIndex) {
          return res.status(404).json({ message: 'pasta não encontrada.' });
        }
        linkIndex.updateOne({linkId: linkIndex.id}, {updatedLinkData})

        res.json(updatedLinkData);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar a pasta.' });
      }

    }
    static async delete(req: Request, res: Response){

      try {
        const userId = req.params.userId
        const dashboardId = req.params.dashboardId
        const linkId = req.params.id;

        const user = await User.findById(userId)
      
        if(!user){
          res.status(500).json('usuário não encontrado')
        }

        const dashboard = user.dashboards.find((d) => d._id.toString() === dashboardId);

        if (!dashboard) {
          return res.status(404).json({ error: 'Dashboard não encontrada' });
        }

        const linkIndex = dashboard.folder.find((f) => f._id.toString() === linkId);


        if (!linkIndex) {
          return res.status(404).json({ message: 'pasta não encontrada.' });
        }
        linkIndex.deleteOne({linkId: linkIndex.id})

        res.json("documento removido");
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Erro ao excluir a pasta.' });
        }
        
    }
}

export default LinkController