import Warehouse from "../Models/Warehouse.js"
export const GetAllWarehouses = async(req, res, next)=>
{
    try
    {
        const warehousesList = await Warehouse.findAll({include:'Products'})
        return res.status(200).json({statusCode:200, message:`${warehousesList.length} warehouses fetched`,result:warehousesList})
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'GetAllWarehouses',message:err.message,capturedDateTime:Date.now()})
    }
}
export const GetWarehousesById = async(req, res, next)=>
{
    try
    {
        const {id:warehouseId} = req.params
        if(!warehouseId) throw new Error('Invalid request, WarehouseId is missing')
        const warehouseFetched = await Warehouse.findOne({where:{Id:warehouseId},include:'Products'})
        if( warehouseFetched ===null || warehouseFetched ===undefined) throw new Error(`warehouse: ${warehouseId} does not exists`)
        return res.status(200).json({statusCode:200, message:`warehouse: ${warehouseId} fetched successfully`,result:warehouseFetched})
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'GetWarehousesById',message:err.message,capturedDateTime:Date.now()})
    }
}
export const CreateWarehouse = async(req, res, next)=>
{
    try
    {
        const warehouseDetails = req.body
        if(!warehouseDetails) throw new Error(`Invalid request, request body is missing for ${warehouseId}`)
        const newWarehouse = await Warehouse.create(req.body)
        return res.status(200).json({statusCode:200, message:`new warehouse:${newWarehouse.Id} created`,result:warehouseFetched})
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'CreateWarehouse',message:err.message,capturedDateTime:Date.now()})
    }
}
export const CreateWarehouseInbulk = async(req, res, next)=>
{
    try
    {
        const warehouseDetails = [...req.body]
        const creationDetails = await Warehouse.bulkCreate(warehouseDetails)
        return res.status(200).json({statusCode:200, message:`${warehouseDetails.length} warehouses created successfully`,result:creationDetails})
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'CreateWarehouseInbulk',message:err.message,capturedDateTime:Date.now()})
    }
}
export const UpdateWarehouse = async(req, res, next)=>
{
    try
    {
        const {id:warehouseId} = req.params
        if(!warehouseId) throw new Error('Invalid request, WarehouseId is missing')
        const warehouseUpdationDetails = req.body
        if(!warehouseUpdationDetails) new Error(`Invalid request, request body is missing for ${warehouseId}`)
        const warehouseFetched = await Warehouse.findByPk(warehouseId)
        if(!warehouseFetched) new Error(`Warehouse: ${warehouseId} does not exists`)
        const response = await warehouseFetched.update(warehouseUpdationDetails)
        await response.save()
        return res.status(200).json({statusCode:200, message:`warehouse: ${warehouseId} updated successfully`})
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'UpdateWarehouse',message:err.message,capturedDateTime:Date.now()})
    }
}
export const DeleteWarehouse = async(req, res, next)=>
{
    try
    {
        const {id:warehouseId} = req.params
        if(!warehouseId) throw new Error('Invalid request, WarehouseId is missing')
        const warehouseFetched = await Warehouse.findByPk(warehouseId)
        if(warehouseFetched) await warehouseFetched.destroy()
        return res.status(200).json({statusCode:200, message:`warehouse: ${warehouseId} deleted successfully`})
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'DeleteWarehouse',message:err.message,capturedDateTime:Date.now()})
    }
}