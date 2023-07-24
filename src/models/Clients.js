const { sequelize } = require('../utils/sequelize')
const { DataTypes } = require('sequelize');

const Clients = sequelize.define('clients', {
    client_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'clients',
    timestamps: false
})

module.exports = { Clients }