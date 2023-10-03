import DashboardController from '../Controller/DashboardController';


import express from 'express'
const router = express.Router();


  router.post('/:userId', DashboardController.post)

  router.get('/:userId', DashboardController.getAll);

  router.get('/:userId', DashboardController.getById);

  router.put('/:id', DashboardController.put);

  router.put('/dashboards/:dashboardId/links/:linkId', DashboardController.putLink);

  router.delete('/:id', DashboardController.delete);

export default router