

const express = require('express')

import DashboardController from '../controller/DashboardController';

const router = express.Router();

  router.post('/', DashboardController.post);

  router.get('/', DashboardController.getAll);

  router.get('/:id', DashboardController.getById);

  router.put('/:id', DashboardController.put);

  router.put('/dashboards/:dashboardId/links/:linkId', DashboardController.putLink);

  router.delete('/:id', DashboardController.delete);

module.exports = router