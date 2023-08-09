const ApiCallsLogs = require("../models/apiCallsLogModel");

const responseHandler =  async function (endpoint, api_request, api_response, user_call, message) {
    let logApi = new ApiCallsLogs({
        api_path: endpoint,
        api_request: (api_request) ? JSON.stringify(api_request) + "" : '',
        api_response: JSON.stringify(api_response) + "",
        user_call: (user_call) ? user_call : null,
    });
    await logApi.save();
    return {
        success: true,
        message: message,
        data: api_response,
    }
}


module.exports = {
    responseHandler
}