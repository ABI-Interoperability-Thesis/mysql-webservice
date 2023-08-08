const { sequelize } = require('../utils/sequelize')
const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const MirthChannels = sequelize.define('mirth-channels', {
    relation_id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true
    },
    channel_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    channel_id: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'mirth_channels',
    timestamps: false
})

module.exports = { MirthChannels }