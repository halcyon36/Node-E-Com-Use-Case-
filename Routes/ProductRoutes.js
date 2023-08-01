import { Router } from "express";
import { GetAllProducts,GetProductById,CreateProduct,UpdateProduct,DeleteProductById,CreateBulkProducts } from "../Controllers/ProductController.js";
const ProductRoutes = Router()
ProductRoutes.get('/',GetAllProducts)
ProductRoutes.get('/:id',GetProductById)
ProductRoutes.post('/',CreateProduct)
ProductRoutes.post('/bulk',CreateBulkProducts)
ProductRoutes.put('/:id',UpdateProduct)
ProductRoutes.delete('/:id',DeleteProductById)
export default ProductRoutes