const { sequelize } = require('../utils/sequelize')
const { DataTypes } = require('sequelize');

const ModelValidations = sequelize.define('model-validations', {
    validation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    model_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    field: {
        type: DataTypes.STRING,
        allowNull: false
    },
    validation_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    source_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    doc_description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    validation_expression: {
        type: DataTypes.TEXT,
        allowNull: false
    }

}, {
    tableName: 'model_validations',
    timestamps: false
})

module.exports = { ModelValidations }