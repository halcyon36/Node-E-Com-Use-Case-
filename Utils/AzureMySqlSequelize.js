import { Sequelize } from "sequelize"
const AzureMySqlSequelize = new Sequelize("sqlite::memory")

// const AzureMySqlSequelize = new Sequelize({
//     host:'199.253.28.226',
//     port:3306,
//     username:'reddyser_reddy',
//     password:'XO6k-TbWHcoZ',
//     database:'reddyser_testdb',
//     dialect:'mysql'
// })
/* const AzureMySqlSequelize = new Sequelize({
    host:'127.0.0.1',
    port:3306,
    username:'root',
    password:'Password@123',
    database:'TestDb',
    dialect:'mysql'
})
export default AzureMySqlSequelize */
/* const AzureMySqlSequelize = new Sequelize({
    host:'reddymysqlserver001.mysql.database.azure.com',
    port:3306,
    username:'reddy',
    password:'Password@123',
    database:'testdb',
    dialect:'mysql',
}) */
export default AzureMySqlSequelize