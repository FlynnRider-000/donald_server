const { Sequelize } = require('sequelize');
var {sequelize} = require('./sequelize');

const ServiceRequestSchema = sequelize.define('ServiceRequest', {
    id: {
        type:Sequelize.INTEGER,
        primaryKey: true
    },
    date: Sequelize.DATE,
    agentId: Sequelize.INTEGER,
    customerId: Sequelize.INTEGER,
    racketId: Sequelize.INTEGER,
    stringId: Sequelize.INTEGER,
    status: Sequelize.INTEGER,
    reqPickTime: Sequelize.DATE,
    location: Sequelize.STRING,
    confPickTime: Sequelize.DATE,
    payed: Sequelize.STRING
},{
    modelName: 'serviceRequest',
    timestamps: false,
    freezeTableName: true,
    tableName: 'pm_service_requests',
})

module.exports = ServiceRequestSchema;