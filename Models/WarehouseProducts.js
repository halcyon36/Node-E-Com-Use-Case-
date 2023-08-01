import { DataTypes } from "sequelize";
import AzureMySqlSequelize from "../Utils/AzureMySqlSequelize.js";
const WarehouseProducts = AzureMySqlSequelize.define('WarehouseProducts',
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
    WarehouseId:
    {
        type:DataTypes.UUID,
        allowNull:false,
        references:
        {
            model:'Warehouse',
            key:'Id'
        }
    },
    Quantity:
    {
        type:DataTypes.DOUBLE,
        defaultValue:0
    }   
})
export default WarehouseProducts