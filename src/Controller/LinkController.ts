import { Response, Request } from "express";
import Link, { ILink } from "../Model/Link";
import User from "../Model/User";

class LinkController {
  static async post(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const dashboardId = req.params.dashboardId;
      const clone: ILink = { ...req.body };
    
      const user = await User.findById(userId);
    
      if (!user) {
        return res.status(500).json("Usuário não encontrado");
      }
      const dashboard = user.dashboards.find(
        (d) => d._id.toString() === dashboardId
      );
    
      if (!dashboard) {
        return res.status(404).json({ error: "Dashboard não encontrada" });
      }
    
      dashboard.link.push(clone);
    
      
      await user.save();
    
      // Agora, vamos buscar o dashboard atualizado do banco de dados
      const updatedDashboard = await User.findById(userId);
    
      res.status(201).json("Salvo com sucesso: " + updatedDashboard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar a pasta." });
    }
  }
  static async getAllInDashboard(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const dashboardId = req.params.dashboardId;
      const user = await User.findById(userId);

      if (!user) {
        res.status(500).json("usuário não encontrado");
      }

      const dashboard = user.dashboards.find(
        (d) => d._id.toString() === dashboardId
      );

      if (!dashboard) {
        return res.status(404).json({ error: "Dashboard não encontrada" });
      }
      const links = dashboard.link;

      res.json(links);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar a pasta." });
    }
  }

  static async put(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const dashboardId = req.params.dashboardId;
      const linkId = req.params.id;
      const updatedLinkData = req.body;
    
      const user = await User.findById(userId);
    
      if (!user) {
        return res.status(500).json("Usuário não encontrado");
      }
    
      const dashboard = user.dashboards.find(
        (d) => d._id.toString() === dashboardId
      );
    
      if (!dashboard) {
        return res.status(404).json({ error: "Dashboard não encontrada" });
      }
    
      
      //@ts-ignore
      const link = dashboard.link.id(linkId);
    
      if (!link) {
        return res.status(404).json({ message: "Link não encontrado." });
      }
    
      
      link.set(updatedLinkData);
    
     
      await user.save();
    
      res.json(link);
    }catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar a pasta." });
    }
  }
  static async delete(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const dashboardId = req.params.dashboardId;
      const linkId = req.params.id;

      const user = await User.findById(userId);

      if (!user) {
        res.status(500).json("usuário não encontrado");
      }

      const dashboard = user.dashboards.find(
        (d) => d._id.toString() === dashboardId
      );

      if (!dashboard) {
        return res.status(404).json({ error: "Dashboard não encontrada" });
      }

      const linkIndex = dashboard.folder.find(
        (f) => f._id.toString() === linkId
      );

      if (!linkIndex) {
        return res.status(404).json({ message: "pasta não encontrada." });
      }
      linkIndex.deleteOne({ linkId: linkIndex.id });

      res.json("documento removido");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao excluir a pasta." });
    }
  }
}

export default LinkController;
