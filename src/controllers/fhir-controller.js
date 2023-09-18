const { FhirMappings } = require('../models/FhirMappings')
const { ModelValidations } = require('../models/ModelValidations')

const supported_versions = ['r4b', 'r5']

const GetFhirVersions = (req, res) => {
    return res.send(supported_versions)
}
const GetFhirSchema = async (req, res) => {
    const version = req.params.version
    const fhir_schema = await GetFhirSchemaFromSystem(version)
    return res.send(fhir_schema)
}

const GetFhirResourceTypes = async (req, res) => {
    const version = req.params.version
    const fhir_schema = await GetFhirSchemaFromSystem(version)
    const resource_types = Object.keys(fhir_schema.discriminator.mapping)
    return res.send(resource_types)
}

const GetFhirResourceTypesDefinitions = async (req, res) => {
    const version = req.params.version
    const definition = req.params.definition
    const fhir_schema = await GetFhirSchemaFromSystem(version)
    const resource_definition = fhir_schema.definitions[definition]
    return res.send(resource_definition)
}

const GetFhirSchemaFromSystem = async (version) => {
    if (supported_versions.includes(version)) {
        const fhir_schema = require(`../fhir/${version}/fhir.schema.json`)
        return fhir_schema
    } else {
        return {
            status: 404,
            message: `Version ${version} is not supported`
        }
    }
}

const TestResourceMapping = async (req, res) => {
    const { fhir_resource, mapping_obj } = req.body
    console.log('Running Updated')
    const mapping_response = await RunFhirMappingUpdated(fhir_resource, mapping_obj)
    return res.send({
        response: mapping_response
    })
}

const RunFhirMappingUpdated = (fhir_resource, mapping_obj) => {
    const {resource_type, mapping} = mapping_obj
    const fhir_resource_type = fhir_resource['resourceType']
    if (resource_type !== fhir_resource_type) return null

    const keys = mapping.split(".");
    let currentObj = fhir_resource;

    for (const key of keys) {
        if (currentObj[key] !== undefined) {
            currentObj = currentObj[key];
        } else {
            // Return an error or a default value if the structure is not as expected
            return null; // You can choose a different default value or error handling approach
        }
    }

    return currentObj;
}

const RunFhirMapping = async (fhir_resource, mapping) => {
    const mapping_array = mapping.split('.')

    let current_resource_part = fhir_resource

    for (let i = 0; i < mapping_array.length; i++) {
        const current_mapping = mapping_array[i]
        console.log(`finding ${current_mapping}`)
        current_resource_part = FindMappingInFhirResource(current_resource_part, current_mapping)
        console.log(current_resource_part)
    }

    return current_resource_part
}

const FindMappingInFhirResource = (current_resource_part, mapping) => {
    // Checking if current resource part is Array
    if (Array.isArray(current_resource_part)) {
        const array_element = current_resource_part[mapping]
        if (array_element !== undefined) {
            console.log(`found ${mapping}`)
            return array_element
        } else {
            return 'no such mapping found'
        }
        // Checking if current resource part is Object
    } else if (typeof current_resource_part === 'object') {
        let matched_element = null
        for (const key in current_resource_part) {
            if (key === mapping) {
                console.log(`found ${mapping}`)
                matched_element = current_resource_part[key]
            }
        }
        if (matched_element === null) {
            return 'no such mapping found'
        } else {
            return matched_element
        }
    } else {
        return current_resource_part
    }
}

const CreateFhirMappings = async (req, res) => {
    try {
        const { client_id, model, model_id, field, mapping, resource_type, mapping_docs } = req.body

        // Creating new mapping
        const new_mapping = await FhirMappings.create(
            {
                client_id,
                model,
                model_id,
                field,
                mapping,
                fhir_resource: resource_type,
                mapping_docs: JSON.stringify(mapping_docs)
            }
        )

        return res.send(new_mapping)
    } catch (error) {
        console.error('Error creating FHIR mapping:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const GetDefaultFhirMappings = async (req, res) => {
    try {
        const { model_id, field } = req.params;

        const mappings = await FhirMappings.findOne({
            where: {
                model_id,
                field,
                client_id: 'Default',
            },
        });

        if (!mappings) {
            // No mappings found, send a custom message
            return res.status(404).json({ message: 'No mappings found for the specified criteria' });
        }

        return res.send(mappings);
    } catch (error) {
        console.error('Error fetching FHIR mappings:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const DeleteFhirMapping = async (req, res) => {
    try {
        const mapping_id = req.params.mapping_id
        await FhirMappings.destroy({
            where: { mapping_id }
        })

        return res.status(200).send('Mapping Deleted')
    } catch (error) {
        console.error('Error deleting Fhir Message:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}




module.exports = {
    GetFhirSchema: GetFhirSchema,
    GetFhirResourceTypes: GetFhirResourceTypes,
    GetFhirResourceTypesDefinitions: GetFhirResourceTypesDefinitions,
    TestResourceMapping: TestResourceMapping,
    GetFhirVersions: GetFhirVersions,
    CreateFhirMappings: CreateFhirMappings,
    GetDefaultFhirMappings: GetDefaultFhirMappings,
    DeleteFhirMapping: DeleteFhirMapping,
    RunFhirMapping: RunFhirMapping,
    RunFhirMappingUpdated: RunFhirMappingUpdated
}