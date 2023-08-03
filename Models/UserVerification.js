import { DataTypes } from "sequelize";
import AzureMySqlSequelize from "../Utils/AzureMySqlSequelize.js";
const UserVerification = AzureMySqlSequelize.define('UserVerification',
{
    VerificationCode:
    {
        type:DataTypes.STRING,
    },
    ExpiresOn:
    {
        type:DataTypes.DATE
    }
},{timestamps:false})
export default UserVerification