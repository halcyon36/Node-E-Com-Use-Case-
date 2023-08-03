import { DataTypes, Sequelize } from "sequelize";
import AzureMySqlSequelize from "../Utils/AzureMySqlSequelize.js";
const UserAddress = AzureMySqlSequelize.define('UserAddress',
{
     Id:
      {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull:false,
        defaultValue:DataTypes.UUIDV4  
      },
      AddressType:
      {
        type: DataTypes.STRING,
        values:["permanent","default","shipping","seller","others"],
        allowNull:true
      },
      AddressLine1: {
        type: DataTypes.STRING,
      },
      AddressLine2: {
        type: DataTypes.STRING,
      },
      ZipCode: {
        type: DataTypes.STRING,
      },
      City: {
        type: DataTypes.STRING,
      },
      State: {
        type: DataTypes.STRING,
      },
      Country: {
        type: DataTypes.STRING,
      },
      UserId:
      {
        type:DataTypes.UUID,
        primaryKey:true,
        references:
        {
            model:'Users',
            key:'Id'
        }
      }
})
export default UserAddress