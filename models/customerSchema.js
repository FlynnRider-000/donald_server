const { Sequelize } = require('sequelize');
var {sequelize} = require('./sequelize');

const CustomerSchema = sequelize.define('Customer', {
    id: {
        type:Sequelize.INTEGER,
        primaryKey: true
    },
    lastName: Sequelize.STRING,
    firstName: Sequelize.STRING,
    street: Sequelize.STRING,
    number: Sequelize.INTEGER,
    ZIPcode: Sequelize.INTEGER,
    city: Sequelize.STRING,
    sportsClub: Sequelize.STRING,
    eMail: Sequelize.STRING,
    phone: Sequelize.STRING
},{
    modelName: 'customer',
    timestamps: false,
    freezeTableName: true,
    tableName: 'pm_customers',
    getterMethods: {
        fullName() {
            return this.firstName + " " +this.lastName;
        }
    }
})

module.exports = CustomerSchema;