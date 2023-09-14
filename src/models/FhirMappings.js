const { sequelize } = require('../utils/sequelize')
const { DataTypes } = require('sequelize');

const FhirMappings = sequelize.define('fhir-mappings', {
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
    fhir_resource: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mapping_docs: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'fhir_mappings',
    timestamps: false
})

module.exports = { FhirMappings }