
import * as express from "express"
import { Request, Response } from "express"
import { myDataSource } from "./index"
import { User } from "../Model/User.ts"
import { ObjectId } from "typeorm"


export const router = express.Router()

  


router.get("/", async function (req: Request, res: Response) {
    const users = await myDataSource.getRepository(User).find()
    res.json(users)
}),


router.get("/:id", async function (req: Request<{id: ObjectId}>, res: Response) {
    const results = await myDataSource.getRepository(User).findOneBy({
        user_id: req.params.id
    })
    return res.send(results)
}),

router.post("/", async function (req: Request, res: Response) {
    const user = await myDataSource.getRepository(User).create(req.body)
    const results = await myDataSource.getRepository(User).save(user)
    return res.send(results)
}),

router.put("/:id", async function (req: Request<{id: ObjectId}>, res: Response) {
    const user = await myDataSource.getRepository(User).findOneBy({
        user_id: req.params.id,
    })
    myDataSource.getRepository(User).merge(user, req.body)
    const results = await myDataSource.getRepository(User).save(user)
    return res.send(results)
}),

router.delete("/:id", async function (req: Request, res: Response) {
    const results = await myDataSource.getRepository(User).delete(req.params.id)
    return res.send(results)
})

module.exports = router