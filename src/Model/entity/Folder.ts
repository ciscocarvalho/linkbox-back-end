import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm"

@Entity()
export class Folder {
    @ObjectIdColumn()
    folder_id: ObjectId

    @Column()
    name: string

    @Column()
    color: string
}