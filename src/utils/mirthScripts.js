const GenerateTransformerScript = (mapping_object) => {
    if (mapping_object.msg_type === 'ORU') {
        return GenerateORUTransformer(mapping_object)
    } else {
        return GenerateTransformer(mapping_object)
    }
}

const GenerateTransformer = (mapping_object) => {
    return `
    var mapping = eval(mapping_element['mapping']).toString();
	var msg_type = msg['MSH']['MSH.9']['MSH.9.1'].toString()
    var msg_trigger = msg['MSH']['MSH.9']['MSH.9.2'].toString()
	
    if (mapping != '' && msg_type === mapping_element['msg_type'] && trigger_events.includes(msg_trigger)) {
		channelMap.put(field_name, mapping);
    }`
}

const GenerateORUTransformer = (mapping_object) => {
    return `
    var mapping = eval(mapping_element['mapping']).toString();
	var msg_type = msg['MSH']['MSH.9']['MSH.9.1'].toString()
    var msg_trigger = msg['MSH']['MSH.9']['MSH.9.2'].toString()
    var mapping_id = msg['OBX']['OBX.3']['OBX.3.1'].toString()
	
    if (mapping != '' && mapping_id === '${mapping_object.mapping_id}' && msg_type === mapping_element['msg_type'] && trigger_events.includes(msg_trigger)) {
		channelMap.put(field_name, mapping);
    }`
}

module.exports = {
    GenerateTransformerScript: GenerateTransformerScript
}