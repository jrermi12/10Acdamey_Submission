import express from "express";
import validateSchema from "../middleware/validateSchema.middleware";
import {
    getAllAteendantsHandler,
    getAteendantsByIdHandler,
    getSessionsByIdHandler

} from '../controller/attendant/index.attendant.controller'
import { AuthJWT } from "../middleware/authJWT"
import { isRegistreeOrSuperAdmin } from "../middleware/role.middleware"
import { updateAttendant } from "../controller/attendant/update.attendant.controller";
import { deleteAttendant } from "../controller/attendant/delete.attendant.controller";

const router = express.Router();


router.get("/get", AuthJWT, getAllAteendantsHandler);
router.get("/show/:id", getAteendantsByIdHandler);
router.get("/session/:id", AuthJWT, getSessionsByIdHandler);

router.patch("/update/:id", AuthJWT, updateAttendant);
router.delete("/delete/:id", AuthJWT, deleteAttendant);




export default router;
