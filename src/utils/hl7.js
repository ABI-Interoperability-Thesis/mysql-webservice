const endpoints = require('../config/endpoints.json')
require('dotenv').config();
const fs = require('fs')
const path = require('path');
const runtime_env = process.env.ENV
const endpoint = endpoints['hl7_docs']
const axios = require('axios')

const getHl7MessageTypes = async () => {
    try {
        const jsonPath = path.join(__dirname, '..', 'hl7', '2.5.1', 'msg_types.json');
        const msg_types = JSON.parse(await fs.readFileSync(jsonPath, 'utf8'));
        return msg_types
    } catch (error) {
        return []
    }
}

const getHl7MessageTriggers = async () => {
    try {
        const jsonPath = path.join(__dirname, '..', 'hl7', '2.5.1', 'msg_triggers.json');
        const msg_triggers = JSON.parse(await fs.readFileSync(jsonPath, 'utf8'));
        return msg_triggers
    } catch (error) {
        return []
    }
}

const getHl7MessageSegments = async () => {
    try {
        const jsonPath = path.join(__dirname, '..', 'hl7', '2.5.1', 'msg_segments_fields.json');
        const msg_fields = JSON.parse(await fs.readFileSync(jsonPath, 'utf8'));
        const msg_segments = Object.keys(msg_fields)
        console.log(msg_segments)
        return Object.keys(msg_fields)
    } catch (error) {
        console.log(error)
        return []
    }
}

const getHl7MessageFields = async (msg_segment) => {
    try {
        const jsonPath = path.join(__dirname, '..', 'hl7', '2.5.1', 'msg_segments_fields.json');
        const msg_fields = JSON.parse(await fs.readFileSync(jsonPath, 'utf8'));
        const selected_segment = msg_fields[msg_segment]
        return Object.keys(selected_segment)
    } catch (error) {
        return []
    }
}

const getHl7MessageSubFields = async (msg_segment) => {
    try {
        const jsonPath = path.join(__dirname, '..', 'hl7', '2.5.1', 'msg_segments_fields.json');
        const msg_fields = JSON.parse(await fs.readFileSync(jsonPath, 'utf8'));
        const formatted_segment = msg_segment.split('.')[0]
        const selected_segment = msg_fields[formatted_segment]
        return selected_segment[msg_segment]
    } catch (error) {
        return []
    }
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

    if (msg_type === 'ORU') {
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