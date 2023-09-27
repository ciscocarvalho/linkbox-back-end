import Folder from "../model/Folder";
import { Request, Response } from "express";

class FolderController{
    static async post(req: Request, res: Response){
        try {
            const clone = {...req.body};
            const newFolder = new Folder(clone);
            const savedFolder = await newFolder.save();
            res.status(201).json(savedFolder);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao criar a pasta.' });
          }

    }
    static async getAll(req: Request, res: Response){

        try {
            const folders = await Folder.find();
            res.json(folders);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao buscar a pasta.' });
          }

    }

    static async getById(req: Request, res: Response){

        try {
            const FolderId = req.params.id;
            const folder = await Folder.findById(FolderId);
            if (!folder) {
              return res.status(404).json({ message: 'Pasta não encontrada.' });
            }
            res.json(folder);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao buscar a pasta' });
          }

    }
    static async put(req: Request, res: Response){

        try {
            const folderId = req.params.id;
            const updatedFolderData = req.body;
            const updatedFolder = await Folder.findByIdAndUpdate(folderId, updatedFolderData, {
              new: true,
            });
            if (!updatedFolder) {
              return res.status(404).json({ message: 'pasta não encontrada.' });
            }
            res.json(updatedFolder);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao atualizar a pasta.' });
          }

    }
    static async delete(req: Request, res: Response){
        try {
            const folderId = req.params.id;
            const deletedFolder = await Folder.findByIdAndRemove(folderId);
            if (!deletedFolder) {
              return res.status(404).json({ message: 'Pasta não encontrada.' });
            }
            res.json(deletedFolder);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao excluir a pasta.' });
          }
    }
}

export default FolderController