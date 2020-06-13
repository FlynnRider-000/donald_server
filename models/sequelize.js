const { Sequelize, Model, DataTypes } = require('sequelize');
const { db_name, db_username, db_password} = require('../config/db');

const sequelize = new Sequelize(db_name, db_username, db_password, {
    dialect: 'mysql'
});

module.exports = {
    sequelize:sequelize,
    sequelizeOp: Sequelize.Op
}