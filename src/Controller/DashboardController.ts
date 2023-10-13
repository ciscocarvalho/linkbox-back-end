import Dashboard, { IDashboard } from "../Model/Dashboard";
import { Request, Response } from "express";
import User from "../Model/User";

class DashboardController {
  static async post(userId, dashboard) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw "erro usuário não encontrado";
      }

      user.dashboards.push(dashboard);
      await user.save();

      return user;
    } catch (error) {
      console.error(error);
    }
  }

  static async getAll(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw "usuário não encontrado";
      }

      const dashboards = user.dashboards;

      return dashboards;
    } catch (error) {
      console.error(error);
      throw "Erro ao buscar a dashboard.";
    }
  }

  static async getById(dashboardId, userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw "Usuário não encontrado.";
      }

      const dashboard = user.dashboards.find(
        (d) => d._id.toString() === dashboardId
      );
       

      if (!dashboard) {
        throw "Dashboard não encontrada.";
      }

      return dashboard;
    } catch (error) {
      console.error(error);
      throw "Erro ao buscar a dashboard";
    }
  }
  static async put(dashboardId, userId, updatedDashboardData) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw "Usuário não encontrado.";
      }

      const dashboard = user.dashboards.find(
        (d) => d._id.toString() === dashboardId
      );

      Object.assign(dashboard, updatedDashboardData);

      await user.save();

      return dashboard;
    } catch (error) {
      console.error(error);
      throw "Erro ao atualizar a dashboard.";
    }
  }

  static async delete(userId, dashboardId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw "Usuário não encontrado.";
      }


      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { 'dashboards': { _id: dashboardId } }
        },
        { new: true }
      );


      return updatedUser;
    } catch (error) {
      console.error(error);
      throw "Erro ao atualizar a dashboard.";
    }
  }
}

export default DashboardController;
