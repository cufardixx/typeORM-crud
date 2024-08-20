import { Router } from "express"
import { createUser, getUsers, updateUser, delateUser, getUser } from "./user.controller"

const router = Router()

router.post("/user", createUser)
router.get("/user", getUser)
router.get("/user/:id", getUser)
router.put("/user/:id", updateUser)
router.delete("/user/:id", delateUser)


export default router