
import User from "../Model/User";

class FolderController {
  static async post(userId, dashboardId, clone) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw "erro ao encontrar o usuário";
      }
      const dashboard = user.dashboards.find(
        (d) => d.title.toString() === dashboardId
      );

      if (!dashboard) {
        throw "erro ao encontrar a dashboard";
      }

      dashboard.folder.push(clone);
      await user.save();

      return dashboard;
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

  static async put(userId, dashboardId, folderId, updatedFolderData) {
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

      const folderIndex =  dashboard.folder.find((f) => f.name.toString() === folderId);
      

      if (!folderIndex) {
        throw "pasta não encontrada.";
      }

      Object.assign(folderIndex, updatedFolderData);

      await user.save();

      return folderIndex;
    } catch (error) {
      console.error(error);
      throw "Erro ao atualizar a pasta.";
    }
  }
  static async delete(userId, dashboardId, folderId) {
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

      const folderIndex = dashboard.folder.find(
        (f) => f.name.toString() === folderId
      );

      if (!folderIndex) {
        throw "pasta não encontrada.";
      }

      folderIndex.deleteOne({ folderId: folderIndex.id });

      await user.save()

      return folderIndex;
    } catch (error) {
      console.error(error);
      throw "Erro ao excluir a pasta.";
    }
  }
}

export default FolderController;
