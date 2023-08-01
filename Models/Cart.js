import { DataTypes } from "sequelize";
import sequelize from "../Utils/sequelize.js";
import MsSqlSequelize from "../Utils/MsSqlSequelize.js";
import MySqlSequelize from "../Utils/MySqlSequelize.js";
import AzureMySqlSequelize from "../Utils/AzureMySqlSequelize.js";
import User from "./User.js";

const Cart = AzureMySqlSequelize.define('Cart',
{
    Id:
    {
        type:DataTypes.UUID,
        primaryKey:true,
        allowNull:false,
        defaultValue:DataTypes.UUIDV4
    },   
    TotalCost:
    {
        type:DataTypes.FLOAT,
        allowNull:false,
        defaultValue:0
    }
},{})
export default Cart