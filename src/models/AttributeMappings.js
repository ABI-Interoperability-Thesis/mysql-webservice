const { sequelize } = require('../utils/sequelize')
const { DataTypes } = require('sequelize');

const AttributeMappings = sequelize.define('attribute-mappings', {
    mapping_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    attribute: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mapping: {
        type: DataTypes.INTEGER,
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
}, {
    tableName: 'attribute_mappings',
    timestamps: false
})

module.exports = { AttributeMappings }