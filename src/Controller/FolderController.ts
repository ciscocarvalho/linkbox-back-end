import { IFolder } from "../Model/Folder";
import User from "../Model/User";
import { traversePath } from "../util/util";

class FolderController {
  static async post(userId: string, dashboardId: string, clone: IFolder, path = "") {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const dashboard = user.dashboards.find((d) => d.title.toString() === dashboardId);

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    if (!path) {
      dashboard.folder.push(clone);
      await user.save();
      return dashboard;
    } else {
      const f = dashboard.folder;
      const pathArray = path.split("/");
      const destinationfolder = await traversePath(pathArray, f);
      destinationfolder.push(clone);
      await user.save();
      return dashboard;
    }
  }
  static async getAll(userId: string, dashboardId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const dashboard = user.dashboards.find((d) => d.title.toString() === dashboardId);

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    const folders = dashboard.folder;

    return folders;
  }

  static async put(userId: string, dashboardId: string, path: string, updatedFolderData: Partial<IFolder>) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const dashboard = user.dashboards.find((d) => d.title.toString() === dashboardId);

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    if (!path) {
      throw new Error("Folder not found");
    } else {
      const f = dashboard.folder;
      const pathArray = path.split("/");
      const destinationfolder = await traversePath(pathArray, f);
      Object.assign(destinationfolder, updatedFolderData);
      await user.save();
      return dashboard;
    }
  }
  static async delete(userId: string, dashboardId: string, path: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const dashboard = user.dashboards.find((d) => d.title.toString() === dashboardId);

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    if (!path) {
      throw new Error("Folder not found");
    } else {
      const f = dashboard.folder;
      const pathArray = path.split("/");
      const toDeleteFolder = await traversePath(pathArray, f);
      toDeleteFolder.remove();

      await user.save();
      return dashboard;
    }
  }
}

export default FolderController;
