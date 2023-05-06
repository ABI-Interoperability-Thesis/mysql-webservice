const { sequelize } = require('../utils/sequelize')
const { DataTypes } = require('sequelize');

const Models = sequelize.define('models', {
    model_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    model_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deployed: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: false
    },
    attribute_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'models',
    timestamps: false
})

module.exports = { Models }