const { sequelize } = require('../utils/sequelize')
const { DataTypes } = require('sequelize');

const Preprocessors = sequelize.define('preprocessors', {
    preprocessor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    preprocessor_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preprocessor_script: {
        type: DataTypes.TEXT,
        allowNull: false
    }

}, {
    tableName: 'preprocessors',
    timestamps: false
})

module.exports = { Preprocessors }