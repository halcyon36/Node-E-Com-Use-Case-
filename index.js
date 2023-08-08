const PORT = 8008;
import Express from "express";
import UserRoutes from "./Routes/UserRoutes.js";
import ProductRoutes from "./Routes/ProductRoutes.js";
import CartRoutes from "./Routes/CartRoutes.js";
import OrderRoutes from "./Routes/OrderRoutes.js";
import UserAddressRoutes from "./Routes/UserAddressRoutes.js";
import WarehouseRoutes from "./Routes/WarehouseRoutes.js";
import ShipmentRoutes from "./Routes/ShipmentRoutes.js";
import ReturnRoutes from "./Routes/ReturnRoutes.js";
import UsersList from './TestFiles/UsersList.js'
import AzureMySqlSequelize from "./Utils/AzureMySqlSequelize.js";
import User from "./Models/User.js";
import Cart from "./Models/Cart.js";
import Order from "./Models/Order.js";
import Product from "./Models/Product.js";
import Warehouse from "./Models/Warehouse.js";
import CartProducts from "./Models/CartProducts.js";
import OrderProducts from "./Models/OrderProducts.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express'
import UserAddress from "./Models/UserAddress.js";
import WarehouseProducts from "./Models/WarehouseProducts.js";
import Shipment from "./Models/Shipment.js";
import Seller from "./Models/Seller.js";
import SellerProducts from "./Models/SellerProducts.js";
import WarehouseSellers from "./Models/WarehouseSellers.js";
import UserVerification from "./Models/UserVerification.js";
import { publishEventtoServiceBus } from "./Utils/publishEventtoServiceBus.js";
const app = Express();
const swaggerOptions = 
{
    swaggerDefinition:
    {
        openai:'3.0.0',
        info:
        {
            title:'E-Com APIs',
            version:'1.0.0',
            description:'My E-Com APIs'
        },
        servers:
        [
            {
                url:`http:localhost:${PORT}`
            }
        ]
    },
    apis:['./Routes/*.js']
}
const swaggerSpec = swaggerJSDoc(swaggerOptions)
app.use(Express.urlencoded({extended:true}))
app.use(Express.json({extended:true}))
app.use(async(req,res,next)=>
{
    // const user = await User.findByPk('d703bf2a-36f1-4145-9eb4-2c82f0368435');
    // req.user = user
    next();
})
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))
app.use('/users',UserRoutes)
app.use('/products',ProductRoutes)
app.use('/cart',CartRoutes)
app.use('/orders',OrderRoutes)
app.use('/userAddress',UserAddressRoutes)
app.use('/warehouse',WarehouseRoutes)
app.use('/shipment',ShipmentRoutes)
app.use('/return',ReturnRoutes)
app.use('/test',async(req,res,next)=>
{
    return res.status(200).json({status:'working'})
})
//user cart (one to one)
User.hasOne(Cart)
Cart.belongsTo(User)

//user address (one to many)
User.hasMany(UserAddress)
UserAddress.belongsTo(User)

//user shipping (one to many)
User.hasMany(Shipment)
Shipment.belongsTo(User)

//user seller (one to one)
User.hasOne(Seller)
Seller.belongsTo(User)

//user email verification table
User.hasOne(UserVerification)
UserVerification.belongsTo(User)

//seller products
Seller.belongsToMany(Product,{through:SellerProducts})
Product.belongsToMany(Seller,{through:SellerProducts})

//seller warehouses
Seller.belongsToMany(Warehouse,{through:WarehouseSellers})
Warehouse.belongsToMany(Seller,{through:WarehouseSellers})

//Cart product
Cart.belongsToMany(Product,{through:CartProducts})
Product.belongsToMany(Cart,{through:CartProducts})

//order users
User.hasMany(Order)
Order.belongsTo(User)

//order products
Order.belongsToMany(Product,{through:OrderProducts})
Product.belongsToMany(Order,{through:OrderProducts})

//warehouse product
Warehouse.belongsToMany(Product,{through:WarehouseProducts})
Product.belongsToMany(Warehouse,{through:WarehouseProducts})

//orders shipment
Order.hasOne(Shipment)
Shipment.belongsTo(Order)
// await user.createCart()
// console.log(await user.getCart())
// const userCart = await user.getCart()
// const product = await Product.findByPk('39bb6ad2-dc1c-42f7-80f2-9f34e916b60d')
// await userCart.addProduct(product)
// const order = await user.createOrder()
// const userOrders = await order.addProducts(await userCart.getProducts())
//await userCart.removeProduct('5bb9c8c7-7c42-4c59-a336-30977948fb59')
// console.log(userOrders)
//app.listen(process.env.PORT||PORT, () => console.log("running!!!"))
AzureMySqlSequelize
  .sync({alter:true})
  .then((_) => app.listen(PORT, () => console.log("running!!!")))
  .catch((err) => console.log(err));