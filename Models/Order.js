import { DataTypes } from "sequelize";
// import sequelize from "../Utils/sequelize.js";
import MsSqlSequelize from "../Utils/MsSqlSequelize.js";
import MySqlSequelize from "../Utils/MySqlSequelize.js";
import Product from "./Product.js";
import AzureMySqlSequelize from "../Utils/AzureMySqlSequelize.js";

const Order = AzureMySqlSequelize.define('Order',
{
    Id:
    {
        type:DataTypes.UUID,
        primaryKey:true,
        allowNull:false,
        defaultValue:DataTypes.UUIDV4
    },
    Status:
    {
        type:DataTypes.STRING,
        values:["pending","cancelled","placed"],
        defaultValue:"pending",
        allowNull:false
    },
    TotalCost:
    {
        type:DataTypes.DOUBLE,
        allowNull:false,
        defaultValue:0
    }
})
export default Order