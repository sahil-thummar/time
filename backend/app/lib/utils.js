module.exports = {
    httpStatusCode: require('http-status-codes'),
    responseGenerators: (responseData, responseStatusCode, responseStatusMsg, responseErrors) => {
        const responseJson = {}
        responseJson['data'] = responseData
        responseJson['status_code'] = responseStatusCode
        responseJson['status_message'] = responseStatusMsg

        // errors
        if (responseErrors === undefined) {
            responseJson['response_error'] = []
        } else {
            responseJson['response_error'] = responseErrors
        }
        return responseJson;
    },
}