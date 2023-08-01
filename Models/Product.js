import { DataTypes } from "sequelize";
import sequelize from "../Utils/sequelize.js";
import Warehouse from "./Warehouse.js";
import Cart from "./Cart.js";
import MsSqlSequelize from "../Utils/MsSqlSequelize.js";
import MySqlSequelize from "../Utils/MySqlSequelize.js";
import AzureMySqlSequelize from "../Utils/AzureMySqlSequelize.js";
const Product = AzureMySqlSequelize.define('Product',
{
    Id:
    {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull:false,
        defaultValue:DataTypes.UUIDV4
    },
    Name:
    {
        type:DataTypes.STRING,
        allowNull:false
    },
    Description:
    {
        type:DataTypes.STRING,
        allowNull:false
    },
    Cost:
    {
        type:DataTypes.DOUBLE
    },
    ImageUrl:
    {
        type:DataTypes.STRING
    },
    Seller:
    {
        type:DataTypes.STRING
    },
    Category:
    {
        type:DataTypes.STRING
    },
    SubCategory:
    {
        type:DataTypes.STRING
    },
    ManufacturedOn:
    {
        type:DataTypes.DATE
    },
    ManufacturedBy:
    {
        type:DataTypes.STRING
    },
    Location:
    {
        type:DataTypes.STRING
    },
    Zipcode:
    {
        type:DataTypes.STRING
    },
    City:
    {
        type:DataTypes.STRING
    },
    State:
    {
        type:DataTypes.STRING
    },
    Country:
    {
        type:DataTypes.STRING
    }
})
export default  Product