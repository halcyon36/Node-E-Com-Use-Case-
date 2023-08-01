import { Router } from "express";
import { GetCart,ClearCart,AddProductToCart,RemoveProductFromCart } from "../Controllers/CartController.js";
const CartRoutes = Router()
CartRoutes.get('/',GetCart)
CartRoutes.delete('/',ClearCart)
CartRoutes.post('/:id',AddProductToCart)
CartRoutes.delete('/:id',RemoveProductFromCart)
export default CartRoutes