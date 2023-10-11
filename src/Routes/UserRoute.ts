
import express from 'express'

import UserController from '../Controller/UserController';
import { checkToken } from '../util/validation';

const router = express.Router();

router.get('/', async (req, res) =>{
    const u = await UserController.getAll()
    res.status(200).json(u)
});

router.get('/:id',checkToken, UserController.getById);

router.put('/:id', UserController.put);

router.delete('/:id', UserController.delete);

export default router
