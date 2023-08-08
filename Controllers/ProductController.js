import Product from "../Models/Product.js";
import Seller from "../Models/Seller.js";
import User from "../Models/User.js";
import UserAddress from "../Models/UserAddress.js";
import Warehouse from "../Models/Warehouse.js";
import { Op } from "sequelize";
export const GetAllProducts = async(req,res,next)=>
{
    try
    {
        const {Zipcode,City,State,Country,sellerName,SellerId,ProductName,Category,SubCategory,MinCost,MaxCost} = req.query
        let addressfilter = {}
        let sellerfilter = {}
        let sellerIdfilter={}
        let productFilters = {}
        if(Zipcode) addressfilter = {...addressfilter,Zipcode:Zipcode} 
        if(City) addressfilter = {...addressfilter,City:City} 
        if(State) addressfilter = {...addressfilter,State:State} 
        if(Country) addressfilter = {...addressfilter,Country:Country} 
        if(sellerName) sellerfilter = {...sellerfilter,FirstName:sellerName}
        if(SellerId) sellerIdfilter = {...sellerIdfilter,Id:SellerId}
        if(ProductName) productFilters = {...productFilters,Name:{[Op.regexp]:`.*${ProductName}.*`}}
        if(Category) productFilters = {...productFilters,Category:Category}
        if(SubCategory) productFilters = {...productFilters,SubCategory:SubCategory}
        if(MinCost && MaxCost) productFilters = {...productFilters,Cost:{[Op.between]:[MinCost,MaxCost]}}
        else if (MinCost) productFilters = {...productFilters,Cost:{[Op.gt]:MinCost}}
        else if (MaxCost) productFilters = {...productFilters,Cost:{[Op.lt]:MaxCost}}
        const productsWithSellerProducts = await User.findAll({where:{IsSeller:true, ...sellerfilter},include:
        [
            {
                model:UserAddress,
                where:{...addressfilter},
            },
            {
                model:Seller,
                where:sellerIdfilter,
                include:
                [
                    {
                        model:Product,
                        where:productFilters,
                        attributes: ['Id', 'Name', 'Description', 'Cost', 'ImageUrl', 'Category', 'SubCategory', 'ManufacturedOn', 'ManufacturedBy'],
                        through:{attributes:["Quantity"]}
                    }
                ]
            }
        ]})
        const outputProductsDetailsWithSellerInfo = productsWithSellerProducts.map((c) => ({
                UserId: c.Id,
                SellerId: c.Seller.Id,
                FirstName: c.FirstName,
                LastName: c.LastName,
                Address:
                {
                    AddressLine1:c.UserAddresses[0].AddressLine1,
                    AddressLine2:c.UserAddresses[0].AddressLine2,
                    ZipCode:c.UserAddresses[0].ZipCode,
                    City:c.UserAddresses[0].City,
                    State:c.UserAddresses[0].State,
                    Country: c.UserAddresses[0].Country
                } ,   
                Products: (!(c.Seller.Products.length>0))?[]:c.Seller.Products.map((product) => ({
                    Id: product.Id,
                    Name: product.Name,
                    Description: product.Description,
                    Cost: product.Cost,
                    ImageUrl: product.ImageUrl,
                    Category: product.Category,
                    SubCategory: product.SubCategory,
                    ManufacturedOn: product.ManufacturedOn,
                    ManufacturedBy: product.ManufacturedBy,
                    AvailabileQuantity: product.SellerProducts.Quantity,
                  }))
          }));
          return res.status(200).json({statusCode:'200',message:`seller products fetched successfully`,records:outputProductsDetailsWithSellerInfo})
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'GetAllProducts',message:err.message,capturedDateTime:Date.now()})
    }
}
export const GetAllSellerProducts = async(req,res,next)=>
{
    try
    {
        const seller = await req.user.getSeller()
        if(!seller) throw new Error(`Please login as a seller to continue`)
        if(!req.user.IsSeller || !seller) throw new Error(`Only sellers are allowed to view their products, please considering registering as a seller to add your products to shop`)
        const products = await seller.getProducts({});
        const outputProducts = (products.length==0)?[]:products.map((c)=>({
            Id: c.Id,
            Name: c.Name,
            Description: c.Description,
            Cost: c.Cost,
            ImageUrl: c.ImageUrl,
            Category: c.Category,
            SubCategory: c.SubCategory,
            ManufacturedOn: c.ManufacturedOn,
            ManufacturedBy: c.ManufacturedBy,
            AvailabileQuantity: c.SellerProducts.Quantity,
        }))
        return res.status(200).json({statusCode:'200',message:`${outputProducts.length} products fetched successfully`,records:outputProducts})
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
        const {productId,sellerId} = req.query
        if(!productId || !sellerId) throw {statusCode:400,message:'Invalid Request, productId/sellerId is missing'}
        const product = await User.findOne({include:[
            {
                model:UserAddress,
                where:{AddressType:'seller'}
            },
            {
                model:Seller,
                where:{Id:sellerId},
                include:
                [
                    {
                        model:Product,
                        where:{Id:productId}
                    }
                ]
            }
        ]})
        console.log(product)
        let outputProductsDetailsWithSellerInfo
        if(product)
            outputProductsDetailsWithSellerInfo = {
            UserId: product.Id,
            SellerId: product.Seller.Id,
            FirstName: product.FirstName,
            LastName: product.LastName,
            Address:
            {
                AddressLine1:product.UserAddresses[0].AddressLine1,
                AddressLine2:product.UserAddresses[0].AddressLine2,
                ZipCode:product.UserAddresses[0].ZipCode,
                City:product.UserAddresses[0].City,
                State:product.UserAddresses[0].State,
                Country: product.UserAddresses[0].Country
            } ,   
            Products: (!(product.Seller.Products.length>0))?[]:product.Seller.Products.map((product) => ({
                Id: product.Id,
                Name: product.Name,
                Description: product.Description,
                Cost: product.Cost,
                ImageUrl: product.ImageUrl,
                Category: product.Category,
                SubCategory: product.SubCategory,
                ManufacturedOn: product.ManufacturedOn,
                ManufacturedBy: product.ManufacturedBy,
                AvailabileQuantity: product.SellerProducts.Quantity,
              }))
      };
        if(!product) throw {statusCode:204,message:`product with ${productId} does not exists`}
        return res.status(200).json({statusCode:'200',message:`Product: ${productId} fetched successfully`,records:outputProductsDetailsWithSellerInfo})
    }
    catch(err)
    {
        return res.status(err.statusCode??'400').json({statusCode:err.statusCode??'400',operation:'GetProductById',message:err.message,capturedDateTime:new Date(Date.now())})        
    }
}
// export const CreateProduct = async(req,res,next)=>
// {
//     try
//     {
//         let product = null;
//         const productDetails = {...req.body}
//         if(!productDetails.Quantity) productDetails.Quantity = 1
//         if(!productDetails) throw new Error('Invalid request, request body missing')
//         const warehouse = await Warehouse.findOne({where:{City:productDetails.City,State:productDetails.State,Location:productDetails.Location,City:productDetails.City,Country:productDetails.Country}})
//         console.log(warehouse)
//         product = (await warehouse.getProducts({where:{Name:productDetails.Name,Seller:productDetails.Seller}}))[0]
//         if(product)
//         {
//             product.WarehouseProducts.Quantity += +productDetails.Quantity
//             await product.WarehouseProducts.save()
//         } 
//         else
//             product = await warehouse.createProduct(productDetails,{through:{Quantity:productDetails.Quantity}})
//         return res.status(200).json({statusCode:'204',message:`Product: ${product.Id} created/Added successfully`,result:product})       
//     }
//     catch(err)
//     {
//         return res.status(400).json({statusCode:'400',operation:'CreateProduct',message:err.message,capturedDateTime:Date.now()})                
//     }
// }
// export const CreateBulkProducts = async(req,res,next)=>
// {
//     try
//     {
//         const seller = await req.user.getSeller()
//         if(!req.user.IsSeller || !seller) throw new Error(`Only sellers are allowed to create products, please considering as a seller`)
//         const productsToCreate = [...req.body]
//         if(productsToCreate.length>0)
//         {
//             const uniqueSet = new Set()
//             productsToCreate.forEach(product=>
//                 {
//                     const {City, Location ,State, Country, Zipcode} = product
//                     const combination = {City, Location, State, Country, Zipcode}//`${City}!${Location}!${State}!${Country}!${Zipcode}`
//                     if(!uniqueSet.has(combination)) uniqueSet.add(JSON.stringify(combination))     
//                 })
//             uniqueSet
//             .forEach(async(productDetails)=>
//                 {
//                     productDetails = JSON.parse(productDetails)
//                     const warehouse = await Warehouse.findOne({where:{State:productDetails.State, Country: productDetails.Country, Zipcode: productDetails.Zipcode}})
//                     const products = productsToCreate.filter(c=> c.Location==productDetails.Location && c.City==productDetails.City && c.State==productDetails.State && c.Zipcode==productDetails.Zipcode && c.Country==productDetails.Country)
//                     products.forEach(async(product)=>
//                     {
//                         try
//                         {
//                             const Quantity = (product.Quantity)?product.Quantity:1
//                             const fetchedProduct = (await warehouse.getProducts({where:{Name:product.Name}}))[0]
//                             console.log('fetched product',fetchedProduct?'yes':'no')
//                             if(fetchedProduct)
//                             {
//                                 fetchedProduct.WarehouseProducts.Quantity += +Quantity
//                                 await fetchedProduct.WarehouseProducts.save()
//                             }
//                             else
//                             {
//                                 await warehouse.createProduct(product,{through:{Quantity:+Quantity}})
//                             }    
//                         }
//                         catch(err)
//                         {
//                             console.log('Error',err.message)
//                         }
//                     })
//                 })
//             const uniqueProductDetails = productsToCreate.map(c=>c.Zipcode)
//             // const createdProducts = await Product.bulkCreate(productsToCreate) 
//             return res.status(200).json({statusCode:200,message:`${productsToCreate.length} products created/Added successfully`})                
//         }
//     }
//     catch(err)
//     {
//         return res.status(err.statusCode?err.statusCode:400).json({statusCode:err.statusCode,message:err.message})
//     }
// }
export const CreateBulkProducts = async(req,res,next)=>
{
    try
    {
        const seller = await req.user.getSeller()
        if(!seller) throw new Error(`Please login as a seller to continue`)
        if(!req.user.IsSeller || !seller) throw new Error(`Only sellers are allowed to create products, please considering as a seller`)
        const productsToCreate = [...req.body]
        if(productsToCreate.length>0)
        {
            productsToCreate.forEach(async (product)=>
            {
                try
                {
                    let Quantity = (product.Quantity)?product.Quantity:1
                    const existingProduct = (await seller.getProducts({where:{Name:product.Name}}))[0]
                    if(existingProduct)
                    {
                        Quantity += existingProduct.SellerProducts.Quantity
                        existingProduct.SellerProducts.Quantity = Quantity
                        await existingProduct.SellerProducts.save()
                    }
                    else
                    {
                        console.log(product)
                        await seller.createProduct({...product},{through:{Quantity:Quantity}})
                    }
                }
                catch(err)
                {
                    console.log(`Unable to add the product:${product.Id}, Error:${err.message}`)
                }
            })
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
        const seller = await req.user.getSeller()
        if(!seller) throw new Error(`Please login as a seller to continue`)
        if(!productId || !productDetails) throw {statusCode:400,message:'Invalid Request, productId or Request Body is missing '}
        let product = (await seller.getProducts({where:{Id:productId}}))[0]
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
        const seller = req.user.getSeller()
        if(!seller) throw new Error(`Please login as a seller to continue`)
        if(!productId || !productDetails) throw {statusCode:400,message:'Invalid Request, productId or Request Body is missing '}
        await seller.removeProduct(productId)
        return res.status(200).json({statusCode:'200',message:`Product: ${productId} deleted successfully`})              
    }
    catch(err)
    {
        return res.status(400).json({statusCode:'400',operation:'DeleteProductById',message:err.message,capturedDateTime:Date.now()})                           
    }
}