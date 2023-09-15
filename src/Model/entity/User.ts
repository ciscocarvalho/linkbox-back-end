import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm"

@Entity()
export class User {
    @ObjectIdColumn()
    user_id: ObjectId

    @Column()
    email: string

    @Column()
    password: string
}