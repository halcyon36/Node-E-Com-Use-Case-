import { DataTypes } from "sequelize"
import MsSqlSequelize from "../Utils/MsSqlSequelize.js"
import MySqlSequelize from "../Utils/MySqlSequelize.js"
import AzureMySqlSequelize from "../Utils/AzureMySqlSequelize.js";
const OrderProducts = AzureMySqlSequelize.define('OrderProducts',
{
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
    Quantity:
    {
        type:DataTypes.DOUBLE,
        defaultValue:0
    }
})
export default OrderProducts