import { Router } from "express"
import { createUser, getUsers, updateUser, delateUser, getUser, loginUser} from "./user.controller"
import { schemaValidation } from "../middlewares/schemaValidacion"
import { createUserSchema, updateUserSchema ,loginUserSchema} from "../schemas/schema.user"

const router = Router()

router.post("/", schemaValidation(createUserSchema), createUser)
router.get("/", getUsers)
router.get("/:id", getUser)
router.put("/:id", schemaValidation(updateUserSchema), updateUser)
router.delete("/:id", delateUser)
router.post("/login", schemaValidation(loginUserSchema), loginUser)


export default router