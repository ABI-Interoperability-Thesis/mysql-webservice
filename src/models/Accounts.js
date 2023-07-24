const { sequelize } = require('../utils/sequelize')
const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const Accounts = sequelize.define('accounts', {
    account_id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'accounts',
    timestamps: false
})

module.exports = { Accounts }