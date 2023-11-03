import { ILink } from "../Model/Link";
import User from "../Model/User";
import { percorrerPath, percorrerPathLink } from "../util/util";

class LinkController {
  static async post(userId: string, dashboardId: string, linkData: ILink, path: string) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw "Usuário não encontrado";
      }
      const dashboard = user.dashboards.find((d) => d.title.toString() === dashboardId);

      if (!dashboard) {
        throw "Dashboard não encontrada";
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
    } catch (error) {
      console.error(error);
      throw "Erro ao criar a pasta.";
    }
  }
  static async getAllInDashboard(userId: string, dashboardId: string) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw "usuário não encontrado";
      }

      const dashboard = user.dashboards.find((d) => d.title.toString() === dashboardId);

      if (!dashboard) {
        throw "Dashboard não encontrada";
      }

      const links = dashboard.link;

      return links;
    } catch (error) {
      console.error(error);
      throw "Erro ao buscar a pasta.";
    }
  }

  static async put(userId: string, dashboardId: string, path: string, updatedLinkData: Partial<ILink>) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw "Usuário não encontrado";
      }

      const dashboard = user.dashboards.find((d) => d.title.toString() === dashboardId);

      if (!dashboard) {
        throw "Dashboard não encontrada";
      }

      if (!path) {
        throw "pasta não encontrada.";
      } else {
        console.log("1");
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
    } catch (error) {
      console.error(error);
      throw "Erro ao atualizar a pasta.";
    }
  }
  static async delete(userId: string, dashboardId: string, path: string) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw "usuário não encontrado";
      }

      const dashboard = user.dashboards.find((d) => d.title.toString() === dashboardId);

      if (!dashboard) {
        throw "Dashboard não encontrada";
      }

      if (!path) {
        throw "pasta não encontrada.";
      } else {
        const f = dashboard.folder;
        const pathArray = path.split("/");
        const link = await percorrerPath(pathArray, f);
        const areaLink = link[0];
        const linkk = areaLink.link;
        console.log(linkk);

        await user.save();
        return link;
      }
    } catch (error) {
      console.error(error);
      throw "Erro ao excluir a pasta.";
    }
  }
}

export default LinkController;
