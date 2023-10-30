
import { IFolder } from "../Model/Folder";
import User from "../Model/User";
import percorrerPath from "../util/util";

class FolderController {
  static async post(userId, dashboardId, clone, path='') {
    try {
      const user = await User.findById(userId);
      console.log('0')
      if (!user) {
        throw "erro ao encontrar o usuário";
      }
      const dashboard = user.dashboards.find(
        (d) => d.title.toString() === dashboardId
      );

      if (!dashboard) {
        throw "erro ao encontrar a dashboard";
      }
      if(!path){
        dashboard.folder.push(clone);
        await user.save();
        return dashboard;
      }else{
        const f = dashboard.folder
        const pathArray = path.split('/')
        const destinationfolder = await percorrerPath(pathArray, f);
        destinationfolder.push(clone)
          await user.save();
        return dashboard;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async getAll(userId, dashboardId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw "usuário não encontrado";
      }

      const dashboard = user.dashboards.find(
        (d) => d.title.toString() === dashboardId
      );

      if (!dashboard) {
        throw "Dashboard não encontrada";
      }
      const folders = dashboard.folder;

      return folders;
    } catch (error) {
      console.error(error);
      throw "Erro ao buscar a pasta.";
    }
  }

  static async put(userId, dashboardId, path, updatedFolderData) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw "usuário não encontrado";
      }

      const dashboard = user.dashboards.find(
        (d) => d.title.toString() === dashboardId
      );

      if (!dashboard) {
        throw "Dashboard não encontrada";
      }

      if(!path){
            throw "pasta não encontrada.";
        }else{
            const f = dashboard.folder
            const pathArray = path.split('/')
            const destinationfolder = await percorrerPath(pathArray, f);
            Object.assign(destinationfolder, updatedFolderData);
              await user.save();
            return dashboard;
          }
      
    } catch (error) {
      console.error(error);
      throw "Erro ao atualizar a pasta.";
    }
  }
  static async delete(userId, dashboardId, path) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw "usuário não encontrado";
      }

      const dashboard = user.dashboards.find(
        (d) => d.title.toString() === dashboardId
      );

      if (!dashboard) {
        throw "Dashboard não encontrada";
      }

      if(!path){
        throw "pasta não encontrada.";
    }else{
        const f = dashboard.folder
        const pathArray = path.split('/')
        const toDeleteFolder = await percorrerPath(pathArray, f);
        console.log(toDeleteFolder)
        toDeleteFolder.remove()
        console.log('------------------')
        
          await user.save();
        return dashboard;
      }
    } catch (error) {
      console.error(error);
      throw "Erro ao excluir a pasta.";
    }
  }
}

export default FolderController;
