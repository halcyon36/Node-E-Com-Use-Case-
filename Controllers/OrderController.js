import Product from "../Models/Product.js"

export const GetOrdersById = async(req,res,next)=>
{
    try
    {
        const {id:orderId} = req.params
        if(!orderId) throw new Error(`invalid request, orderId is missing`)
        if(!req.user.hasOrder(orderId)) throw new Error(`${orderId} doesn't exists`)
        let orders = await req.user.getOrders({where:{Id:orderId},include:'Products'})
        if(orders.length>0)    
            orders = orders.map(order=>
            ({
                OrderId:order.Id,
                UserId:order.UserId,
                OrderStatus:order.Status,
                TotalCost:order.TotalCost,
                createdAt:order.createdAt,
                updatedAt:order.updatedAt,
                Products:order.Products.map(product=>({
                    Id: product.Id,
                    Name: product.Name,
                    Description: product.Description,
                    Cost: product.Cost,
                    ImageUrl: product.ImageUrl,
                    Category: product.Category,
                    SubCategory: product.SubCategory,
                    ManufacturedOn: product.ManufacturedOn,
                    ManufacturedBy: product.ManufacturedBy,
                    OrderedQuantity: product.OrderProducts.Quantity,
                }))
            }))
        return res.status(200).json({statusCode:'200',message:`Order: ${orderId} fetched successfully`,records:orders}) 
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'GetOrders',message:err.message,capturedDateTime:Date.now()})
    }
}
export const GetOrdersByStatus = async(req,res,next)=>
{
    try
    {
        const {status:orderStatus} = req.query
        let orders
        const user = req.user;
        if(orderStatus==='pending')
            orders = await user.getOrders({where:{status:orderStatus},include:'Products'})
        else if(orderStatus==='placed')
            orders = await user.getOrders({where:{status:orderStatus},include:'Products'})
        else if(orderStatus==='cancelled')
            orders = await user.getOrders({where:{status:orderStatus},include:'Products'})
        else 
            orders = await user.getOrders({include:'Products'})
        if(orders.length>0)
            orders = orders.map(order=>
            ({
                OrderId:order.Id,
                UserId:order.UserId,
                OrderStatus:order.Status,
                TotalCost:order.TotalCost,
                createdAt:order.createdAt,
                updatedAt:order.updatedAt,
                Products:order.Products.map(product=>({
                    Id: product.Id,
                    Name: product.Name,
                    Description: product.Description,
                    Cost: product.Cost,
                    ImageUrl: product.ImageUrl,
                    Category: product.Category,
                    SubCategory: product.SubCategory,
                    ManufacturedOn: product.ManufacturedOn,
                    ManufacturedBy: product.ManufacturedBy,
                    OrderedQuantity: product.OrderProducts.Quantity,
                }))
            }))
        return res.status(200).json({statusCode:'200',message:`${orders.length} ${(orderStatus==='pending'||orderStatus==='placed'||orderStatus==='cancelled')?orderStatus+' ':''}orders found`,records:orders}) 
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'GetOrders',message:err.message,capturedDateTime:Date.now()})
    }
}
export const CreateOrder = async(req,res,next)=>
{
    try
    {
        let userCart = await req.user.getCart()
        if(userCart)
        {
            const userOrder = await req.user.createOrder({TotalCost:userCart.TotalCost})
            const userBasketProducts = await userCart.getProducts()
            //check availability
            // let productsAvailable = true
            // userBasketProducts.forEach(async(product)=>
            // {
            //     const productExists = await Product.findOne({where:{Id:product.Id,Quantity:product.CartProducts.Quantity}})
            //      if(!productExists) productsAvailable = false
            // })
            // if(!productsAvailable)
            //     return res.status(200).json({statusCode:'400',message:`Order:${orderId} creation failed due to products unavailability`})
        
            userBasketProducts.forEach(async(product)=>
                {
                    await userOrder.addProducts(product,{through:{Quantity:product.CartProducts.Quantity}})
                })
            await userCart.destroy()
            return res.status(200).json({statusCode:'200',message:`Order: ${userOrder.Id} placed with ${userBasketProducts.length} Basket Products`,result:{orderId:userOrder.Id}})     
        }
        else
        {
            return res.status(200).json({statusCode:'400',message:`Order Creation Failed`})     
        }
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'CreateOrder',message:err.message,capturedDateTime:Date.now()})
    }
}
export const PlaceOrder = async(req,res,next)=>
{
    try
    {
        const {id:orderId} = req.params
        if(!orderId) new Error('Invalid request, OrderId is missing')
        let fetchedOrder = (await req.user.getOrders({where:{Id:orderId}}))[0]
        if(!fetchedOrder) throw new Error(`Order:${orderId} is invalid or does not exists`)
        fetchedOrder.Status = 'placed'
        //send an event to hub stating order placed with orderId
        
        await fetchedOrder.save()
        return res.status(200).json({statusCode:'200',message:`Order:${orderId} Placed successfully`})
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'CreateOrder',message:err.message,capturedDateTime:Date.now()})
    }
}
export const DeleteOrder = async(req,res,next)=>
{
    try
    {
        const {id:orderId} = req.params
        if(!orderId) throw new Error(`Invalid request, orderId is missing`)
        const userOrder = (await req.user.getOrders({where:{Id:orderId}}))[0]
        if(userOrder)
        {
            await userOrder.destroy()
            return res.status(200).json({statusCode:'200',message:`Order: ${orderId} deletion successful`})         
        }
        else 
            return res.status(400).json({statusCode:'400',message:`Order: ${orderId} does not exists`})     
    }   
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'CancelOrder',message:err.message,capturedDateTime:Date.now()})
    }
}
export const CancelOrder = async(req,res,next)=>
{
    try
    {
        const {id:orderId} = req.params
        if(!orderId) throw new Error(`Invalid request, orderId is missing`)
        const userOrder = await req.user.getOrders({where:{Id:orderId}})
        if(userOrder)
        {
            userOrder[0].Status = 'cancelled'
            await userOrder[0].save()
            return res.status(200).json({statusCode:'200',message:`Order: ${orderId} cancel successful`,result:{orderId:userOrder[0].Id}})         
        }
        else 
            return res.status(400).json({statusCode:'200',message:`Order: ${orderId} does not exists`})     
    }   
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'CancelOrder',message:err.message,capturedDateTime:Date.now()})
    }
}