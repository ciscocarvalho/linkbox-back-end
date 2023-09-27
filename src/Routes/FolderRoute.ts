
const express = require('express')

import FolderController from '../controller/FolderController';

const router = express.Router();


  router.post('/', FolderController.post);

  router.get('/', FolderController.getAll);


  router.get('/:id', FolderController.getById);


  router.put('/:id', FolderController.put);

  router.delete('/:id',FolderController.delete);

  module.exports = router