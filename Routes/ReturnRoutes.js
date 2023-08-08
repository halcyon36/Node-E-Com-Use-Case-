import { Router } from "express";
import { GetReturn,ClearReturn,AddReturn,CancelReturn } from "../Controllers/ReturnController.js";
const ReturnRoutes = Router()
ReturnRoutes.get('/',GetReturn)
ReturnRoutes.delete('/',ClearReturn)
ReturnRoutes.post('/:pid&:oid&:reason',AddReturn)
ReturnRoutes.delete('/:id',CancelReturn)
export default ReturnRoutes