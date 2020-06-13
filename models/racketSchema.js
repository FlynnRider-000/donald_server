const { Sequelize } = require('sequelize');
var {sequelize} = require('./sequelize');

const RacketSchema = sequelize.define('Racket', {
    id: {
        type:Sequelize.INTEGER,
        primaryKey: true
    },
    sportType: Sequelize.STRING,
    Brand: Sequelize.STRING,
    Name: Sequelize.STRING,
    Grip: Sequelize.STRING,
},{
    modelName: 'racket',
    timestamps: false,
    freezeTableName: true,
    tableName: 'pm_rackets'
})

module.exports = RacketSchema;