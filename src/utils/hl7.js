const endpoints = require('../config/endpoints.json')
require('dotenv').config();
const runtime_env = process.env.ENV
const endpoint = endpoints['hl7_docs'][runtime_env]
const axios = require('axios')

const getHl7MessageTypes = async () => {
    const config = {
        method: 'get',
        url: `${endpoint}/Tables/0076`,
        headers: {}
    };
    const axios_response = await axios(config)
    const hl7_msg_types = axios_response.data.entries

    return hl7_msg_types
}

const getHl7MessageTriggers = async () => {
    const config = {
        method: 'get',
        url: `${endpoint}/TriggerEvents`,
        headers: {}
    };

    const axios_response = await axios(config)
    const hl7_msg_triggers = axios_response.data

    const hl7_msg_triggers_ids = hl7_msg_triggers.map(obj => obj.id);

    const hl7_msg_triggers_ids_processed = hl7_msg_triggers_ids.map(trigger => {
        const parts = trigger.split('_');
        return parts.length > 1 ? parts[1] : trigger;
    });

    return hl7_msg_triggers_ids_processed
}

const getHl7MessageSegments = async () => {
    const config = {
        method: 'get',
        url: `${endpoint}/Segments`,
        headers: {}
    };

    const axios_response = await axios(config)
    const hl7_msg_segments = axios_response.data

    const hl7_msg_segments_ids = hl7_msg_segments.map(obj => obj.id);

    return hl7_msg_segments_ids
}

const getHl7MessageFields = async (msg_segment) => {
    const config = {
        method: 'get',
        url: `${endpoint}/Segments/${msg_segment}`,
        headers: {}
    };

    const axios_response = await axios(config)
    const hl7_msg_segments = axios_response.data

    const hl7_msg_segments_ids = hl7_msg_segments.fields.map(obj => obj.id);

    return hl7_msg_segments_ids
}

const getHl7MessageSubFields = async (msg_segment) => {
    const config = {
        method: 'get',
        url: `${endpoint}/Fields/${msg_segment}`,
        headers: {}
    };

    const axios_response = await axios(config)
    const hl7_msg_segments = axios_response.data

    const hl7_msg_segments_ids = hl7_msg_segments.fields.map(obj => obj.id);

    return hl7_msg_segments_ids
}

module.exports = {
    getHl7MessageTypes: getHl7MessageTypes,
    getHl7MessageTriggers: getHl7MessageTriggers,
    getHl7MessageSegments: getHl7MessageSegments,
    getHl7MessageFields: getHl7MessageFields,
    getHl7MessageSubFields: getHl7MessageSubFields
}