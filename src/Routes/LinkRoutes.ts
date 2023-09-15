
import * as express from "express"
import { Request, Response } from "express"
import { myDataSource } from "./index"
import { ObjectId } from "typeorm"
import { Link } from "../Model/entity/Link.ts"


export const router = express.Router()

  


router.get("/", async function (req: Request, res: Response) {
    const link = await myDataSource.getRepository(Link).find()
    res.json(link)
}),


router.get("/:id", async function (req: Request<{id: ObjectId}>, res: Response) {
    const results = await myDataSource.getRepository(Link).findOneBy({
        link_id: req.params.id
    })
    return res.send(results)
}),

router.post("/", async function (req: Request, res: Response) {
    const link = await myDataSource.getRepository(Link).create(req.body)
    const results = await myDataSource.getRepository(Link).save(link)
    return res.send(results)
}),

router.put("/:id", async function (req: Request<{id: ObjectId}>, res: Response) {
    const link = await myDataSource.getRepository(Link).findOneBy({
        link_id: req.params.id,
    })
    myDataSource.getRepository(Link).merge(link, req.body)
    const results = await myDataSource.getRepository(Link).save(link)
    return res.send(results)
}),

router.delete("/:id", async function (req: Request, res: Response) {
    const results = await myDataSource.getRepository(Link).delete(req.params.id)
    return res.send(results)
})

module.exports = router