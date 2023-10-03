
import express from 'express'

import FolderController from '../Controller/FolderController';

const router = express.Router();


  router.post('/:userId/:dashboardId', FolderController.post);

  router.get('/:userId/:dashboardId', FolderController.getAll);

  router.put('/:userId/:dashboardId/:folderId', FolderController.put);

  router.delete('/:userId/:dashboardId/:folderId',FolderController.delete);

  export default router