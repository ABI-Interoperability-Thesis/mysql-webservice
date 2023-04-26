const { sequelize } = require('../utils/sequelize')
const { DataTypes } = require('sequelize');

const Table = sequelize.define('hosp-pred', {
    req_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false
    },
    urg_episodio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hora_admissao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cod_causa: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cod_proveniencia: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cod_prioridade: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idade: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cod_via_verde: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sexo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    afluencia: {
        type: DataTypes.STRING,
        allowNull: false
    },
    los: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'hospitalization_prediction',
    timestamps: false
})

module.exports = {Table}