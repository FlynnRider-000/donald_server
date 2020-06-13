const { Sequelize } = require('sequelize');
var {sequelize} = require('./sequelize');

const StringSchema = sequelize.define('String', {
    id: {
        type:Sequelize.INTEGER,
        primaryKey: true
    },
    Brand: Sequelize.STRING,
    Name: Sequelize.STRING,
    Thickness: Sequelize.STRING,
    Color: Sequelize.STRING,
    Hardness: Sequelize.STRING,
},{
    modelName: 'string',
    timestamps: false,
    freezeTableName: true,
    tableName: 'pm_strings'
})

module.exports = StringSchema;