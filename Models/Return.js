import { DataTypes } from "sequelize";
import AzureMySqlSequelize from "../Utils/AzureMySqlSequelize.js";

const Return = AzureMySqlSequelize.define('Return',
{
    Id:
    {
        type:DataTypes.UUID,
        primaryKey:true,
        allowNull:false,
        defaultValue:DataTypes.UUIDV4
    },
    ProductId:
    {
        type:DataTypes.UUID,
        allowNull:false,
        references:
        {
            model:'Products',
            key:'Id'
        }
    },
    OrderId:
    {
        type:DataTypes.UUID,
        allowNull:false,
        references:
        {
            model:'Orders',
            key:'Id'
        }
    },
    Reason:
    {
        type:DataTypes.STRING,
        values:["Poor Quality","Damage","Misplaced Product"],
        allowNull:false
    },
    Status:
    {
        type:DataTypes.STRING,
        values:["pending","completed","cancelled"],
        defaultValue:"pending",
        allowNull:false
    }
})
export default Return