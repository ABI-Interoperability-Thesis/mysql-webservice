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
    try {
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
    } catch (error) {
        return []
    }
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

const GenerateHL7Message = (msg_type, msg_triggers, mapping, attribute_name) => {
    let generated_message = `MSH|^~\&|HOSPITAL|ADT|HL7LAB|ADT|201904021200||${msg_type}^${msg_triggers[0]}|56789|P|2.5`

    const generated_segment = GenerateHL7Segment(mapping, msg_type, attribute_name)

    const final_message = generated_message + generated_segment

    return final_message

}

const GenerateHL7Segment = (mapping, msg_type, attribute_name) => {
    const segment_string = mapping[0]
    const field_string = mapping[1];
    const subfield_string = mapping[2]

    const fieldNumber = parseInt(field_string.split('.')[1]);
    const fieldNumberIterator = fieldNumber + 5

    let curr_iteration = 0

    let generated_segment = ''

    if(msg_type === 'ORU') {
        generated_segment += `\nOBX|||${attribute_name}`
        curr_iteration = 4
    }

    for (let i = curr_iteration; i < fieldNumberIterator; i++) {
        if (i === 0) {
            generated_segment += `\n${segment_string}`
        } else {
            if (i === fieldNumber + 1) {
                generated_segment += GenerateHL7Subfield(subfield_string)
            } else {
                generated_segment += '|'
            }
        }
    }

    return generated_segment
}

const GenerateHL7Subfield = (subfield_string) => {
    const subfieldNumber = parseInt(subfield_string.split('.')[2]);

    let generated_sub_field = ''

    for (let i = 0; i < subfieldNumber; i++) {
        if (i === subfieldNumber - 1) {
            generated_sub_field += 'your_value'
        } else {
            generated_sub_field += '^'
        }
    }

    return generated_sub_field
}

module.exports = {
    getHl7MessageTypes: getHl7MessageTypes,
    getHl7MessageTriggers: getHl7MessageTriggers,
    getHl7MessageSegments: getHl7MessageSegments,
    getHl7MessageFields: getHl7MessageFields,
    getHl7MessageSubFields: getHl7MessageSubFields,
    GenerateHL7Message: GenerateHL7Message
}