import express from "express";
import validateSchema from "../middleware/validateSchema.middleware";
import {
    createExhibitorsHandler,
    updateExhibitor,
    getExhibitor,
    checkExhibitor,
    getExhibitorById,
    deleteExhibitor,
    deleteEx,
    getAssociatedByExhibitorId
} from '../controller/exhibitor/index.exhibitor.controller'
import { createExhibitorSchema, updateExhibitorSchema, deleteExhibitorSchema } from "../utils/validation/exhibitor.validation"
import { AuthJWT } from "../middleware/authJWT"
import { isRegistreeOrSuperAdmin } from "../middleware/role.middleware"
const router = express.Router();
import upload from "../config/multer"

// AuthJWT, isRegistreeOrSuperAdmin,
router.post("/create",  upload.single("csvData"), createExhibitorsHandler);
router.get("/get", getExhibitor);
router.get("/show/:id", AuthJWT, getExhibitorById);
router.get("/attendee/:id", AuthJWT, getAssociatedByExhibitorId);

router.get("/check/:id", AuthJWT, checkExhibitor)
router.patch("/update/:id", AuthJWT, isRegistreeOrSuperAdmin, validateSchema(updateExhibitorSchema), updateExhibitor)
router.delete("/delete", deleteEx)
export default router;
