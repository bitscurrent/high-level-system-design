import {Router} from "express"
import {sendMessageToKafka} from "../controllers/kafkapublisher.controller.js";

const router = Router()
router.post('/', sendMessageToKafka);

export default router;