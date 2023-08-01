import { Sequelize } from "sequelize"
const AzureMySqlSequelize = new Sequelize({
    host:'reddymysqlserver001.mysql.database.azure.com',
    port:3306,
    username:'reddy',
    password:'Password@123',
    database:'testdb',
    dialect:'mysql',
})
export default AzureMySqlSequelize