import { Router } from "express"
import { createUser, getUsers, updateUser, delateUser, getUser } from "./user.controller"
import { schemaValidation } from "../middlewares/schemaValidacion"
import { createUserSchema, updateUserSchema } from "../schemas/schema.user"

const router = Router()

router.post("/user", schemaValidation(createUserSchema), createUser)
router.get("/user", getUsers)
router.get("/user/:id", getUser)
router.put("/user/:id", schemaValidation(updateUserSchema), updateUser)
router.delete("/user/:id", delateUser)


export default router