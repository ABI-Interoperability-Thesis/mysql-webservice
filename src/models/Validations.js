const { sequelize } = require('../utils/sequelize')
const { DataTypes } = require('sequelize');

const Validations = sequelize.define('validations', {
    validation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    validation_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    validation_source_type: {
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
    tableName: 'validations',
    timestamps: false
})

module.exports = { Validations }