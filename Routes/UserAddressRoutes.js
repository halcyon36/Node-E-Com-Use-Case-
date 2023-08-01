import { Router } from "express";
import {getUserAddress, addUserAddress, setDefaultAddress} from "../Controllers/UserController.js"
const UserAddressRoutes = Router()
UserAddressRoutes.get('/',getUserAddress)
UserAddressRoutes.post('/',addUserAddress)
UserAddressRoutes.put('/:id',setDefaultAddress)
export default UserAddressRoutes