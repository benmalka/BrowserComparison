/**
 * 
 * Function returns reformulate Network Data
 * 
 * @param {object} params  Network object from WebDriver.Network.requestWillBeSent event
 * @returns {object}
 */
function CreateRequestNetworkData(params){
    return { timestamp: params.timestamp,
             type:      params.type, 
             url:       params.request.url, 
             method:    params.request.method,
             requestId: params.requestId};
}
/**
 * 
 * Function returns reformulate Network Data
 * 
 * @param {object} params  Network object from WebDriver.Network.responseRecived event
 * @returns {object}
 */
function CreateResponseNetworkData(params){
    return { timestamp: params.timestamp,
             type:      params.type, 
             url:       params.response.url, 
             status:    params.response.status,
             requestId: params.requestId};
}

module.exports = {CreateRequestNetworkData, CreateResponseNetworkData};
