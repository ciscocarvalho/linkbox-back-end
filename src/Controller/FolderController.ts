import { IFolder } from "../Model/Folder";
import User from "../Model/User";
import { percorrerPath } from "../util/util";

class FolderController {
  static async post(userId: string, dashboardId: string, clone: IFolder, path = "") {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("erro ao encontrar o usuário");
    }

    const dashboard = user.dashboards.find((d) => d.title.toString() === dashboardId);

    if (!dashboard) {
      throw new Error("erro ao encontrar a dashboard");
    }

    if (!path) {
      dashboard.folder.push(clone);
      await user.save();
      return dashboard;
    } else {
      const f = dashboard.folder;
      const pathArray = path.split("/");
      const destinationfolder = await percorrerPath(pathArray, f);
      destinationfolder.push(clone);
      await user.save();
      return dashboard;
    }
  }
  static async getAll(userId: string, dashboardId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("usuário não encontrado");
    }

    const dashboard = user.dashboards.find((d) => d.title.toString() === dashboardId);

    if (!dashboard) {
      throw new Error("Dashboard não encontrada");
    }

    const folders = dashboard.folder;

    return folders;
  }

  static async put(userId: string, dashboardId: string, path: string, updatedFolderData: Partial<IFolder>) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("usuário não encontrado");
    }

    const dashboard = user.dashboards.find((d) => d.title.toString() === dashboardId);

    if (!dashboard) {
      throw new Error("Dashboard não encontrada");
    }

    if (!path) {
      throw new Error("pasta não encontrada.");
    } else {
      const f = dashboard.folder;
      const pathArray = path.split("/");
      const destinationfolder = await percorrerPath(pathArray, f);
      Object.assign(destinationfolder, updatedFolderData);
      await user.save();
      return dashboard;
    }
  }
  static async delete(userId: string, dashboardId: string, path: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("usuário não encontrado");
    }

    const dashboard = user.dashboards.find((d) => d.title.toString() === dashboardId);

    if (!dashboard) {
      throw new Error("Dashboard não encontrada");
    }

    if (!path) {
      throw new Error("pasta não encontrada.");
    } else {
      const f = dashboard.folder;
      const pathArray = path.split("/");
      const toDeleteFolder = await percorrerPath(pathArray, f);
      toDeleteFolder.remove();

      await user.save();
      return dashboard;
    }
  }
}

export default FolderController;
