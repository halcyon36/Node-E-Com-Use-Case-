import { Router } from "express";
import {GetAllUsers,GetUserById,CreateUser,UpdateUser,DeleteUser,CreateBulkUsers} from "../Controllers/UserController.js"
const UserRoutes = Router()
UserRoutes.get('/',GetAllUsers)
UserRoutes.get('/:id',GetUserById)
UserRoutes.post('/',CreateUser)
UserRoutes.post('/bulk',CreateBulkUsers)
UserRoutes.put('/:id',UpdateUser)
UserRoutes.delete('/:id',DeleteUser)
export default UserRoutes