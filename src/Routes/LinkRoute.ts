const express = require('express')

import LinkController from '../Controller/LinkController';

const router = express.Router();


  router.post('/userId/:dashboardId', LinkController.post)

  router.get('/:userId/:dashboardId', LinkController.getAllInDashboard);

  router.put('/:userId/:dashboardId/:id', LinkController.put);

  router.delete('/:userId/:dashboardId/:id', LinkController.delete);


  module.exports = router