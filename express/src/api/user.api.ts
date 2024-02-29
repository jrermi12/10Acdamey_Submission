import express from "express";
import validateSchema from "../middleware/validateSchema.middleware";
import {
    createUser,
    updateUser,
    getAllUsers,
    getUserById,
    deleteUser
} from '../controller/user/index.user.controller'
import { createUserSchema, deleteUserSchema, updateUserSchema } from "../utils/validation/user.validation"
import { AuthJWT } from "../middleware/authJWT"
import { isSuperAdmin } from "../middleware/role.middleware"

const router = express.Router();


router.post("/create", AuthJWT, isSuperAdmin, validateSchema(createUserSchema), createUser);
router.get("/get", getAllUsers);
router.get("/show/:id", AuthJWT, getUserById);
router.patch("/update/:id", AuthJWT, validateSchema(updateUserSchema), updateUser);
router.delete("/delete/:id", AuthJWT, validateSchema(deleteUserSchema), deleteUser);





export default router;




