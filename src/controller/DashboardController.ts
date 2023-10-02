import Dashboard, { IDashboard } from "../Model/Dashboard";
import { Request, Response } from "express";
import User from "../Model/User";

class DashboardController{


    static async post(req: Request, res: Response) {
        try {
          const userId = req.params.userId
          const clone: IDashboard = { ...req.body };
          const user = await User.findById(userId)


          if(!user){
            res.status(500).json('usuário não encontrado')
          }

          user.dashboards.push(clone);
          await user.save()

          //const newDashboard = new Dashboard(clone);
          //const savedDashboard = await newDashboard.save();
      
          res.status(201).json("sucesso ao registrar a dashboard"); 
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Erro ao criar a dashboard.' });
        }
      }
      
    static async getAll(req: Request, res: Response){
        try {
            const userId = req.params.userId
            const user = await User.findById(userId)

            if(!user){
              res.status(500).json('usuário não encontrado')
            }

            const dashboards = user.dashboards;

            res.json(dashboards);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao buscar a dashboard.' });
          }

    }

    static async getById(req: Request, res: Response){
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

    }
    static async put(req: Request, res: Response){

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

    }

    static async putLink(req: Request, res: Response){
        const dashboardId = req.params.dashboardId;
    const linkId = req.params.linkId;
    const updatedLinkData = req.body;
  
    try {
      

      const dashboard = await Dashboard.findById(dashboardId);


      if (!dashboard) {
        return res.status(404).json({ message: 'Dashboard não encontrado.' });
      }

      const linkToUpdate = dashboard.link.find(link => link._id.equals(linkId));
      
      if (!linkToUpdate) {
        return res.status(404).json({ message: 'Link não encontrado.' });
      }
  
      linkToUpdate.set(updatedLinkData);
  
      
      await dashboard.save();
  
      res.json(dashboard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar o subdocumento link.' });
    }
    }
    static async delete(req: Request, res: Response){
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
    }
}

export default DashboardController