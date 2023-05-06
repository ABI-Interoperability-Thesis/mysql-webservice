const { sequelize } = require('../utils/sequelize')
const { DataTypes } = require('sequelize');

const ModelAttributes = sequelize.define('model-attributes', {
    model_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: false
    },

}, {
    tableName: 'model-attributes',
    timestamps: false
})

module.exports = { ModelAttributes }