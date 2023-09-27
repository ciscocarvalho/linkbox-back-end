const express = require('express')

import LinkController from '../controller/LinkController';

const router = express.Router();


router.post('/', LinkController.post)

  router.get('/', LinkController.getAll);


  router.get('/:id', LinkController.getById);


  router.put('/:id', LinkController.put);

  router.delete('/:id', LinkController.delete);


  module.exports = router