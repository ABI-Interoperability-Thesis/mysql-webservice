const { sequelize } = require('../utils/sequelize')
const { DataTypes } = require('sequelize');

const ClientsModels = sequelize.define('clients-models', {
    rel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    client_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    client_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    access: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'clients_models',
    timestamps: false
})

module.exports = { ClientsModels }