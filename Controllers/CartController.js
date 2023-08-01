import Cart from "../Models/Cart.js";
import Product from "../Models/Product.js";
import { Op } from "sequelize";
export const GetCart = async(req,res,next)=>
{
    try
    {
        const userCart = await req.user.getCart({include:'Products'})
        console.log(userCart)
        return res.status(200).json({statusCode:'200',message:`User:${req.user.Id} cart is fetched successfully`,records:userCart})
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'GetCart',message:err.message,capturedDateTime:Date.now()})
    }
}
export const ClearCart = async(req,res,next)=>
{
    try
    {
        const userCart = await req.user.getCart()
        if(userCart)
            await userCart.destroy()
        return res.status(200).json({statusCode:'200',message:`User:${req.user.Id} cart has been cleared successfully`})
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'GetCart',message:err.message,capturedDateTime:Date.now()})
    }
}
export const AddProductToCart = async(req,res,next)=>
{
    try
    {
        const {id:productId} = req.params
        const quantity = req.query.quantity?+req.query.quantity:1
        let userCart = await req.user.getCart()
        if(!userCart)
            userCart = await req.user.createCart()
        const hasProduct = await userCart.hasProduct(productId)
        if(hasProduct)
        {
            const existingProduct = await userCart.getProducts({where:{Id:productId}})
            console.log(existingProduct)
            await userCart.addProduct(existingProduct[0],{through:{Quantity:+existingProduct[0].CartProducts.Quantity+quantity}})
            userCart.TotalCost = (parseFloat(userCart.TotalCost) + quantity * existingProduct[0].Cost).toFixed(4)
            await userCart.save()
        }
        else
        {
            const productToAdd = await Product.findByPk(productId)
            const cartProduct = await userCart.addProduct(productToAdd,{through:{Quantity:quantity}})
            userCart.TotalCost = (parseFloat(userCart.TotalCost) + quantity * productToAdd.Cost).toFixed(4)
            await userCart.save()
        }
        return res.status(200).json({statusCode:'200',message:`${quantity} products are added to User:${req.user.Id} cart `})
    }
    catch(err)
    {
        console.log(err)
        return res.status(400).json({statusCode:'400',operation:'GetCart',message:err.message,capturedDateTime:Date.now()})
    }
}
export const RemoveProductFromCart = async(req,res,next)=>
{
    try
    {
        const {id:productId} = req.params 
        const quantity = req.query.quantity?+req.query.quantity:1
        let userCart = await req.user.getCart()
        if(userCart)
        {
            const foundProduct = (await userCart.getProducts({where:{Id:productId}}))[0]
            if(!foundProduct) throw new Error(`Product: ${productId} does not exists`)
            if(foundProduct.CartProducts.Quantity>=quantity)
            {
                if(foundProduct.CartProducts.Quantity>quantity)
                    await userCart.addProduct(foundProduct,{through:{Quantity:foundProduct.CartProducts.Quantity-quantity}})
                else
                    await userCart.removeProduct(productId)
                userCart.TotalCost = (parseFloat(userCart.TotalCost)-foundProduct.Cost*quantity).toFixed(4)  
                await userCart.save()
            }
            else throw new Error(`Product: ${productId}  requested removal Quantity:${quantity} is greater than available quantity:${foundProduct.CartProducts.Quantity}`)
        }
        return res.status(200).json({statusCode:'200',message:`Products:${productId} is removed from User:${req.user.Id} cart `,records:[productId]})
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'RemoveProductFromCart',message:err.message,capturedDateTime:Date.now()})
    }
}
