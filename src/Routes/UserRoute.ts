
import express from 'express'

import UserController from '../Controller/UserController';
import { checkToken } from '../util/validation';

const router = express.Router();

router.get('/', UserController.getAll);

router.get('/:id',checkToken, UserController.getById);

router.put('/:id', UserController.put);

router.delete('/:id', UserController.delete);

export default router
