import Folder, { IFolder } from "../Model/Folder";
import { Request, Response } from "express";
import User from "../Model/User";

class FolderController{
    static async post(req: Request, res: Response){
        try {
            const userId = req.params.userId
            const dashboardId = req.params.dashboardId
            const clone: IFolder = {...req.body};

            const user = await User.findById(userId)

            if(!user){
              res.status(500).json('usuário não encontrado')
            }
            const dashboard = user.dashboards.find((d) => d._id.toString() === dashboardId);
  
            if (!dashboard) {
              return res.status(404).json({ error: 'Dashboard não encontrada' });
            }
            
            dashboard.folder.push(clone)


            res.status(201).json("Salvo com sucesso: " + dashboard);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao criar a pasta.' });
          }

    }
    static async getAll(req: Request, res: Response){

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
          const folders = dashboard.folder

            res.json(folders);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao buscar a pasta.' });
          }

    }

    static async put(req: Request, res: Response){

        try {
            const userId = req.params.userId
            const dashboardId = req.params.dashboardId
            const folderId = req.params.id;
            const updatedFolderData = req.body;

            const user = await User.findById(userId)
          
            if(!user){
              res.status(500).json('usuário não encontrado')
            }
  
            const dashboard = user.dashboards.find((d) => d._id.toString() === dashboardId);
  
            if (!dashboard) {
              return res.status(404).json({ error: 'Dashboard não encontrada' });
            }

            const folderIndex = dashboard.folder.find((f) => f._id.toString() === folderId);


            if (!folderIndex) {
              return res.status(404).json({ message: 'pasta não encontrada.' });
            }
            folderIndex.updateOne({folderId: folderIndex.id}, {updatedFolderData})

            res.json(updatedFolderData);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao atualizar a pasta.' });
          }

    }
    static async delete(req: Request, res: Response){
        try {
          const userId = req.params.userId
          const dashboardId = req.params.dashboardId
          const folderId = req.params.id;

          const user = await User.findById(userId)
        
          if(!user){
            res.status(500).json('usuário não encontrado')
          }

          const dashboard = user.dashboards.find((d) => d._id.toString() === dashboardId);

          if (!dashboard) {
            return res.status(404).json({ error: 'Dashboard não encontrada' });
          }

          const folderIndex = dashboard.folder.find((f) => f._id.toString() === folderId);


          if (!folderIndex) {
            return res.status(404).json({ message: 'pasta não encontrada.' });
          }
          folderIndex.deleteOne({folderId: folderIndex.id})

          res.json("documento removido");
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao excluir a pasta.' });
          }
    }
}

export default FolderController