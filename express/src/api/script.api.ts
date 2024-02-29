import {
    getLunchLength,
    getSuststanblity,
    getPresent,
    getSnumber,
    // writeToCSV,
    getFarmersDay,
    getIWCABreakfast,
    getBagCollection,
    getMeeting
} from "../controller/script/script.controller"
import { writeToCSV } from "../controller/script/export.controller"
import express from "express";
const router = express.Router();


router.get('/lunch', getLunchLength)
router.get('/sustanblity', getSuststanblity)
router.get('/getSnumber', getSnumber)

router.get('/present', getPresent)
router.get('/farmersDay', getFarmersDay)
router.get('/iwca', getIWCABreakfast)
router.get('/bag', getBagCollection)
router.get('/meeting', getMeeting)






router.get("/export", writeToCSV)




export default router;