import express from "express";
import user from "./user.api"
// import help from "./help.api"
import auth from "./auth.api"
import exhibitor from "./exhibitor.api"
import associated from "./associated.api"
import attendant from "./attendant.api"
import badge from "./badge.api"
import script from "./script.api"



const router = express.Router()

router.use("/user", user);
router.use("/exhibitor", exhibitor);
router.use("/script", script)
// router.use("/help", help);
router.use("/auth", auth);
router.use("/badge", badge);
router.use("/associated", associated);
router.use("/attendant", attendant);





export default router;