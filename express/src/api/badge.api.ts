import express from "express";
import validateSchema from "../middleware/validateSchema.middleware";
import {
    createBadgeHandler,
    getAllBadgesHandler,
    getBadgeByIdHandler,
    generateBadge,
    generateBadgee,
    deleteRecordsByName, 
    exportDataToCSV, 
    getBadgescanned

    // updateBadgeHandler,
    // deleteBadgeHandler
} from '../controller/badge/index.badge.controller'
import { calculateAndSaveTotalPrices } from '../controller/badge/create.badge.controller'
import { registerAndCreateBadgeSchema, scanBadgeSchema, updateBadgeSchema } from "../utils/validation/badge.validation"
import { AuthJWT } from "../middleware/authJWT"
import { isRegistreeOrSuperAdmin } from "../middleware/role.middleware"

import upload from "../config/multer"
import { updateBadgeHandler } from "../controller/badge/update.badge.controller";
import { deleteBadge } from "../controller/badge/delete.badge.controller";
import { scanBadge } from "../controller/badge/scanning.badge.controller";
const router = express.Router();


router.post("/create", upload.single("csvData"), createBadgeHandler);
router.get("/show/:id", getBadgeByIdHandler);
router.get("/get", getAllBadgesHandler);
router.get('/total', calculateAndSaveTotalPrices )
router.post('/generate-badge',  generateBadge);
router.post('/generate-badgee',  generateBadgee);
router.get("/getBadgescanned", getBadgescanned)
router.patch("/update/:badge_id", AuthJWT, isRegistreeOrSuperAdmin, validateSchema(updateBadgeSchema), updateBadgeHandler)
router.delete("/delete/:id", AuthJWT, isRegistreeOrSuperAdmin, deleteBadge)
router.post("/delete", deleteRecordsByName)
router.post("/scan", validateSchema(scanBadgeSchema), scanBadge)





export default router;