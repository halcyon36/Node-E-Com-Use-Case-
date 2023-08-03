import { DataTypes } from "sequelize";
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
    }    
})
export default  Product