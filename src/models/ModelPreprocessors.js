const { sequelize } = require('../utils/sequelize')
const { DataTypes } = require('sequelize');

const ModelPreprocessors = sequelize.define('models-preprocessors', {
    preprocessor_id: {
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
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    doc_description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    preprocessor_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preprocessor_script: {
        type: DataTypes.TEXT,
        allowNull: false
    }

}, {
    tableName: 'models_preprocessors',
    timestamps: false
})

module.exports = { ModelPreprocessors }