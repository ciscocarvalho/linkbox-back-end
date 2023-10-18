import { Response, Request } from "express";
import Link, { ILink } from "../Model/Link";
import User from "../Model/User";

class LinkController {
  static async post(userId,dashboardId,linkData) {
    try {

    
      const user = await User.findById(userId);
    
      if (!user) {
        throw "Usuário não encontrado"
      }
      const dashboard = user.dashboards.find(
        (d) => d.title.toString() === dashboardId
      );
    
      if (!dashboard) {
       throw "Dashboard não encontrada" 
      }
    
      dashboard.link.push(linkData);
    
      await user.save();
    
      return dashboard
    } catch (error) {
      console.error(error);
      throw "Erro ao criar a pasta."
    }
  }
  static async getAllInDashboard(userId, dashboardId) {
    try {
     
      const user = await User.findById(userId);

      if (!user) {
       throw "usuário não encontrado"
      }

      const dashboard = user.dashboards.find(
        (d) => d.title.toString() === dashboardId
      );

      if (!dashboard) {
        throw "Dashboard não encontrada"
      }
      const links = dashboard.link;

      return links

    } catch (error) {
      console.error(error);
     throw "Erro ao buscar a pasta."
    }
  }

  static async put(userId,dashboardId,linkId, updatedLinkData) {
    try {
      
      
    
      const user = await User.findById(userId);
    
      if (!user) {
        throw "Usuário não encontrado"
      }
    
      const dashboard = user.dashboards.find(
        (d) => d.title.toString() === dashboardId
      );
    
      if (!dashboard) {
       throw "Dashboard não encontrada"
      }
    
      
     
      const link = dashboard.link.find(
        (l) => l.name.toString() === linkId
      );
    
      if (!link) {
        throw "Link não encontrado."
      }
    
      
      link.set(updatedLinkData);
    
     
      await user.save();
    
      return link

    }catch (error) {
      console.error(error);
      throw "Erro ao atualizar a pasta."
    }
  }
  static async delete(userId, dashboardId, linkId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
       throw "usuário não encontrado"
      }

      const dashboard = user.dashboards.find(
        (d) => d.title.toString() === dashboardId
      );

      if (!dashboard) {
       throw "Dashboard não encontrada"
      }

      const linkIndex = dashboard.folder.find(
        (f) => f.name.toString() === linkId
      );

      if (!linkIndex) {
        throw "pasta não encontrada."
      }

      linkIndex.deleteOne({ linkId: linkIndex.id });
      
      await user.save()

      return linkIndex
    } catch (error) {
      console.error(error);
      throw "Erro ao excluir a pasta."
    }
  }
}

export default LinkController;
