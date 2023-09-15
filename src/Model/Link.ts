import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm"

@Entity()
export class Link {
    @ObjectIdColumn()
    link_id: ObjectId

    @Column()
    name: string

    @Column()
    url: string

    @Column()
    descricao: string

    @Column()
    color: string
}