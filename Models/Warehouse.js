import { DataTypes } from "sequelize";
import AzureMySqlSequelize from "../Utils/AzureMySqlSequelize.js";
const Warehouse = AzureMySqlSequelize.define('Warehouse',
{
    Id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull:false,
        defaultValue:DataTypes.UUIDV4
      },
    Name:
    {
        type:DataTypes.STRING
    },
    Description:
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
export default Warehouse