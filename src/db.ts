import { DataSource } from "typeorm"
import { User } from "./entities/User/user.entity"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "typeormdb",
    entities: [User],
    logging: true,
    synchronize: true
})