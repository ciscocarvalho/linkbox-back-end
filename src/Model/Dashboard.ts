import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm"
import { Link } from "./Link"
import { Folder } from "./Folder"

@Entity()
export class Dashboard {
    @ObjectIdColumn()
    dashboard_id: ObjectId

    @Column()
    name: string

    @Column((type)=> Link)
    link: Link

    @Column((type) => Folder)
    folder:Folder

    constructor(name: string, link: Link, folder:Folder, dashboard_id: ObjectId ) {
        this.name = name
        this.link = link
        this.dashboard_id = dashboard_id
        this.folder = folder
    }
}