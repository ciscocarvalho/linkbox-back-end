import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm"
import { Dashboard } from "./Dashboard"

@Entity()
export class User {
    @ObjectIdColumn()
    user_id: ObjectId

    @Column()
    email: string

    @Column()
    password: string

    @Column((type) => Dashboard)
    dashboard: Dashboard
}

