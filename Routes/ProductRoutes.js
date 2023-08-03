import { Router } from "express";
import { GetAllSellerProducts,GetAllProducts,GetProductById,UpdateProduct,DeleteProductById,CreateBulkProducts } from "../Controllers/ProductController.js";
const ProductRoutes = Router()
ProductRoutes.get('/',GetAllProducts)
ProductRoutes.get('/seller',GetAllSellerProducts)
ProductRoutes.get('/single',GetProductById)
// ProductRoutes.post('/',CreateProduct)
ProductRoutes.post('/bulk',CreateBulkProducts)
ProductRoutes.put('/:id',UpdateProduct)
ProductRoutes.delete('/:id',DeleteProductById)
export default ProductRoutes