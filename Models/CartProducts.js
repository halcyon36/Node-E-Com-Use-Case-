import { DataTypes } from "sequelize"
// import MsSqlSequelize from "../Utils/MsSqlSequelize.js"
// import MySqlSequelize from "../Utils/MySqlSequelize.js"
import AzureMySqlSequelize from "../Utils/AzureMySqlSequelize.js";

const CartProducts = AzureMySqlSequelize.define('CartProducts',
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
    CartId:
    {
        type:DataTypes.UUID,
        allowNull:false,
        references:
        {
            model:'Carts',
            key:'Id'
        }
    },
    Quantity:
    {
        type:DataTypes.DOUBLE,
        defaultValue:0
    }
})
export default CartProducts