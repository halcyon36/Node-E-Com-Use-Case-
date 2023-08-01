import { Router } from "express";
import { getAllShipmentsForUser, getShippingDetails, createShipmentOrder, updateShipmentStatus, deleteShipmentDetails } from "../Controllers/ShipmentController.js";
const ShipmentRoutes = Router()
ShipmentRoutes.get('/',getAllShipmentsForUser)
ShipmentRoutes.get('/:id',getShippingDetails)
ShipmentRoutes.post('/:id',createShipmentOrder)
ShipmentRoutes.patch('/:id',updateShipmentStatus)
ShipmentRoutes.delete('/:id',deleteShipmentDetails)
export default ShipmentRoutes