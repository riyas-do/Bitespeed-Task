const Sequelize = require('sequelize');
let sequelize;

if (process.env.NODE_ENV === "production") {
    sequelize = new Sequelize(process.env.DATABASE_URL);
  }else{
    sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.USER,
    process.env.PASSWORD,
    {
        host: process.env.HOST,
        dialect: 'postgres',
    }

)};
   
const contacts = sequelize.define('contacts', {
    id: { type: Sequelize.INTEGER, autoIncrement: true,primaryKey:true },
    phoneNumber: { type: Sequelize.INTEGER },
    email: { type: Sequelize.STRING },
    linkedId: { type: Sequelize.INTEGER },
    linkPrecedence: { type: Sequelize.STRING },
})

sequelize.sync();
module.exports = {sequelize,contacts,AND}