import express from "express";
import validateSchema from "../middleware/validateSchema.middleware";
import {
    createAttendantsHandler,
    getAllAttendantsHandler,
    getAttendantByIdHandler,
    getAssociatedAttendantsByExhibitorIdHandler

} from '../controller/associatedExhibitor/index.attendant.controller'
import { createAttendantSchema, updateAttendantSchema } from "../utils/validation/attendant.validation"
import { AuthJWT } from "../middleware/authJWT"
import { isRegistreeOrSuperAdmin } from "../middleware/role.middleware"

const router = express.Router();


router.post("/create/:id", AuthJWT, isRegistreeOrSuperAdmin, validateSchema(createAttendantSchema), createAttendantsHandler);
router.get("/get", AuthJWT, getAllAttendantsHandler);
router.get("/show/:id", AuthJWT, getAttendantByIdHandler);
router.get("/check/:name", AuthJWT, isRegistreeOrSuperAdmin, getAssociatedAttendantsByExhibitorIdHandler)


export default router;
