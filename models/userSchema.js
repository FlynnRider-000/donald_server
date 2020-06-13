const { Sequelize } = require('sequelize');
var {sequelize} = require('./sequelize');

const UserSchema = sequelize.define('User', {
    id: {
        type:Sequelize.INTEGER,
        primaryKey: true
    },
    userName: Sequelize.STRING,
    passWord: Sequelize.STRING,
    lastName: Sequelize.STRING,
    firstName: Sequelize.STRING,
    street: Sequelize.STRING,
    number: Sequelize.INTEGER,
    ZIPcode: Sequelize.INTEGER,
    city: Sequelize.STRING,
    sportsClub: Sequelize.STRING,
    eMail: Sequelize.STRING,
    phone: Sequelize.STRING,
    role: Sequelize.INTEGER
},{
    modelName: 'user',
    timestamps: false,
    freezeTableName: true,
    tableName: 'pm_users',
    getterMethods: {
        fullName() {
            return this.firstName + " " +this.lastName;
        }
    }
})

module.exports = UserSchema;