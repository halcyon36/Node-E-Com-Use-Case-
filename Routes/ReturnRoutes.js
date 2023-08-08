import { Router } from "express";
import { GetReturn,GetReturnById,AddReturn,CancelReturn } from "../Controllers/ReturnController.js";
const ReturnRoutes = Router()
ReturnRoutes.get('/',GetReturn)
ReturnRoutes.get('/:id',GetReturnById)
ReturnRoutes.post('/',AddReturn)
ReturnRoutes.put('/cancel/:id',CancelReturn)
export default ReturnRoutes