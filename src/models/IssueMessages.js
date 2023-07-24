const { sequelize } = require('../utils/sequelize')
const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const IssueMessages = sequelize.define('issue-messages', {
    message_id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true
    },
    issue_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    sent_by_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sent_by_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    created: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    tableName: 'issue_messages',
    timestamps: false
})

module.exports = { IssueMessages }