const { sequelize } = require('../utils/sequelize')
const { DataTypes } = require('sequelize');

const ClientMappings = sequelize.define('client-mappings', {
    mapping_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    client_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    field: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mapping: {
        type: DataTypes.STRING,
        allowNull: false
    },
    msg_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    msg_triggers: {
        type: DataTypes.STRING,
        allowNull: false
    },
    transformer_script: {
        type: DataTypes.TEXT,
        allowNull: false
    }

}, {
    tableName: 'client_mappings',
    timestamps: false
})

module.exports = { ClientMappings }