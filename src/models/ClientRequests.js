const { sequelize } = require('../utils/sequelize')
const { DataTypes } = require('sequelize');

const ClientRequests = sequelize.define('client-requests', {
    model_data_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    answered: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    answer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    request_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    client_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_date: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    tableName: 'client_requests',
    timestamps: false
})

module.exports = {ClientRequests}