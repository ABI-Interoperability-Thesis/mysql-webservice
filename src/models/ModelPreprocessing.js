const { sequelize } = require('../utils/sequelize')
const { DataTypes } = require('sequelize');

const ModelPreprocessing = sequelize.define('models-preprocessing', {
    processing_id: {
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
    preprocessing_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preprocessing_script: {
        type: DataTypes.TEXT,
        allowNull: false
    }

}, {
    tableName: 'models_preprocessing',
    timestamps: false
})

module.exports = { ModelPreprocessing }