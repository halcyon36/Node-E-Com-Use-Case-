import { Router } from "express";
import { GetAllWarehouses,GetWarehousesById,CreateWarehouse,UpdateWarehouse,DeleteWarehouse,CreateWarehouseInbulk } from "../Controllers/WarehouseController.js";
const WarehouseRoutes = Router()
WarehouseRoutes.get('/',GetAllWarehouses)
WarehouseRoutes.get('/:id',GetWarehousesById)
WarehouseRoutes.post('/bulk',CreateWarehouseInbulk)
WarehouseRoutes.post('/',CreateWarehouse)
WarehouseRoutes.patch('/:id',UpdateWarehouse)
WarehouseRoutes.delete('/:id',DeleteWarehouse)
export default WarehouseRoutes