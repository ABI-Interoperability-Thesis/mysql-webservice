const { sequelize } = require('../utils/sequelize')
const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const Issues = sequelize.define('issues', {
    issue_id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true
    },
    issue_title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    issue_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    client_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    client_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    answered: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    created: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    tableName: 'issues',
    timestamps: false
})

module.exports = { Issues }