import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm"
import { Link } from "./Link"

@Entity()
export class Folder {
    @ObjectIdColumn()
    folder_id: ObjectId

    @Column()
    name: string

    @Column()
    parent_id: ObjectId

    @Column()
    color: string

    @Column((type)=> Link)
    link: Link

    constructor(color: string, name: string, folder_id: ObjectId, link: Link, parent_id: ObjectId) {
        this.color = color
        this.name = name
        this.folder_id = folder_id
        this.link = link
        this.parent_id = new ObjectId
    }
}