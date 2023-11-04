import { ILink } from "../Model/Link";
import User from "../Model/User";
import { percorrerPath, percorrerPathLink } from "../util/util";

class LinkController {
  static async post(userId: string, dashboardId: string, linkData: ILink, path: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    const dashboard = user.dashboards.find((d) => d.title.toString() === dashboardId);

    if (!dashboard) {
      throw new Error("Dashboard não encontrada");
    }

    if (!path) {
      dashboard.link.push(linkData);
      await user.save();
      return dashboard;
    } else {
      const f = dashboard.folder;
      const pathArray = path.split("/");
      const destinationfolder = await percorrerPathLink(pathArray, f);
      const area = destinationfolder.link;
      area.push(linkData);
      await user.save();
      return dashboard;
    }
  }
  static async getAllInDashboard(userId: string, dashboardId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("usuário não encontrado");
    }

    const dashboard = user.dashboards.find((d) => d.title.toString() === dashboardId);

    if (!dashboard) {
      throw new Error("Dashboard não encontrada");
    }

    const links = dashboard.link;

    return links;
  }

  static async put(userId: string, dashboardId: string, path: string, updatedLinkData: Partial<ILink>) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const dashboard = user.dashboards.find((d) => d.title.toString() === dashboardId);

    if (!dashboard) {
      throw new Error("Dashboard não encontrada");
    }

    if (!path) {
      throw new Error("pasta não encontrada.");
    }

    const f = dashboard.folder;
    const pathArray = path.split("/");
    const nomeDoLink = pathArray.pop();
    const destinationfolder = await percorrerPathLink(pathArray, f);
    const area = destinationfolder.link as [ILink];
    const linkToUpadte = area.filter((element) => {
      return element.name.toString() === nomeDoLink;
    });
    Object.assign(linkToUpadte, updatedLinkData);
    await user.save();
    return linkToUpadte;
  }
  static async delete(userId: string, dashboardId: string, path: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw Error("usuário não encontrado");
    }

    const dashboard = user.dashboards.find((d) => d.title.toString() === dashboardId);

    if (!dashboard) {
      throw Error("Dashboard não encontrada");
    }

    if (!path) {
      throw Error("pasta não encontrada.");
    }

    const f = dashboard.folder;
    const pathArray = path.split("/");
    const link = await percorrerPath(pathArray, f);

    await user.save();
    return link;
  }
}

export default LinkController;
