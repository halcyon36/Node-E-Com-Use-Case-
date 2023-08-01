import { DataTypes } from "sequelize";
import sequelize from "../Utils/sequelize.js";
import MsSqlSequelize from "../Utils/MsSqlSequelize.js";
import MySqlSequelize from "../Utils/MySqlSequelize.js";
import AzureMySqlSequelize from "../Utils/AzureMySqlSequelize.js";
const User = AzureMySqlSequelize.define(
  "User",
  {
    Id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull:false,
      defaultValue:DataTypes.UUIDV4
    },
    FirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PreferredName:
    {
        type: DataTypes.STRING
    },
    Age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UserName:
    {
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey:true
    },
    Email:
    {
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    MobileNumber:
    {
        type:DataTypes.STRING,
        allowNull:false,
        // unique:true
    },
    PasswordHash:
    {
        type:DataTypes.STRING,
        allowNull:false,
    }
  },
  { timestamps: true }
);

export default User;
