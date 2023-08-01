import Product from "../Models/Product.js";
import Warehouse from "../Models/Warehouse.js";
export const GetAllProducts = async(req,res,next)=>
{
    try
    {
        const products = await Product.findAll();
        return res.status(200).json({statusCode:'200',message:`${products.length} products fetched successfully`,records:products})
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'GetAllProducts',message:err.message,capturedDateTime:Date.now()})
    }
}
export const GetProductById = async(req,res,next)=>
{
    try
    {
        const {id:productId} = req.params
        if(!productId) throw {statusCode:400,message:'Invalid Request, productId is missing'}
        const product = await Product.findOne({where:{Id:productId}})
        if(!product) throw {statusCode:404,message:`product with ${productId} does not exists`}
        return res.status(200).json({statusCode:'200',message:`Product: ${product.Id} fetched successfully`,records:[product]})
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'GetProductById',message:err.message,capturedDateTime:Date.now()})        
    }
}
export const CreateProduct = async(req,res,next)=>
{
    try
    {
        let product = null;
        const productDetails = {...req.body}
        if(!productDetails.Quantity) productDetails.Quantity = 1
        if(!productDetails) throw new Error('Invalid request, request body missing')
        const warehouse = await Warehouse.findOne({where:{City:productDetails.City,State:productDetails.State,Location:productDetails.Location,City:productDetails.City,Country:productDetails.Country}})
        console.log(warehouse)
        product = (await warehouse.getProducts({where:{Name:productDetails.Name,Seller:productDetails.Seller}}))[0]
        if(product)
        {
            product.WarehouseProducts.Quantity += +productDetails.Quantity
            await product.WarehouseProducts.save()
        } 
        else
            product = await warehouse.createProduct(productDetails,{through:{Quantity:productDetails.Quantity}})
        return res.status(200).json({statusCode:'204',message:`Product: ${product.Id} created/Added successfully`,result:product})       
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'CreateProduct',message:err.message,capturedDateTime:Date.now()})                
    }
}
export const CreateBulkProducts = async(req,res,next)=>
{
    try
    {
        const productsToCreate = [...req.body]
        if(productsToCreate.length>0)
        {
            const uniqueSet = new Set()
            productsToCreate.forEach(product=>
                {
                    const {City, Location ,State, Country, Zipcode} = product
                    const combination = {City, Location, State, Country, Zipcode}//`${City}!${Location}!${State}!${Country}!${Zipcode}`
                    if(!uniqueSet.has(combination)) uniqueSet.add(JSON.stringify(combination))     
                })
            uniqueSet
            .forEach(async(productDetails)=>
                {
                    productDetails = JSON.parse(productDetails)
                    const warehouse = await Warehouse.findOne({where:{State:productDetails.State, Country: productDetails.Country, Zipcode: productDetails.Zipcode}})
                    const products = productsToCreate.filter(c=> c.Location==productDetails.Location && c.City==productDetails.City && c.State==productDetails.State && c.Zipcode==productDetails.Zipcode && c.Country==productDetails.Country)
                    products.forEach(async(product)=>
                    {
                        try
                        {
                            const fetchedProduct = (await warehouse.getProducts({where:{Name:product.Name}}))[0]
                            console.log('fetched product',fetchedProduct?'yes':'no')
                            if(fetchedProduct)
                            {
                                fetchedProduct.WarehouseProducts.Quantity += 1
                                await fetchedProduct.WarehouseProducts.save()
                            }
                            else
                            {
                                await warehouse.createProduct(product,{through:{Quantity:1}})
                            }    
                        }
                        catch(err)
                        {
                            console.log('Error',err.message)
                        }
                    })
                })
            const uniqueProductDetails = productsToCreate.map(c=>c.Zipcode)
            // const createdProducts = await Product.bulkCreate(productsToCreate) 
            return res.status(200).json({statusCode:200,message:`${productsToCreate.length} products created/Added successfully`})                
        }
    }
    catch(err)
    {
        return res.status(err.statusCode?err.statusCode:400).json({statusCode:err.statusCode,message:err.message})
    }
}

export const UpdateProduct = async(req,res,next)=>
{
    try
    {
        const {id:productId} = req.params
        const productDetails = {...req.body}
        if(!productId || !productDetails) throw {statusCode:400,message:'Invalid Request, productId or Request Body is missing '}
        const product = await Product.findOne({where:{Id:productId}})
        if(!product) throw {statusCode:404,message:`product with ${productId} does not exists`}
        product = await product.update(productDetails)
        return res.status(200).json({statusCode:'200',message:`Product: ${product.Id} updated successfully`})              
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'UpdateProduct',message:err.message,capturedDateTime:Date.now()})                   
    }
}
export const DeleteProductById = async(req,res,next)=>
{
    try
    {
        const {id:productId} = req.params
        if(!productId || !productDetails) throw {statusCode:400,message:'Invalid Request, productId or Request Body is missing '}
        const product = await Product.findOne({where:{Id:productId}})
        if(!product) throw {statusCode:404,message:`product with ${productId} does not exists`}
        return res.status(200).json({statusCode:'200',message:`Product: ${product.Id} deleted successfully`})              
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'DeleteProductById',message:err.message,capturedDateTime:Date.now()})                           
    }
}