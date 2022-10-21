const axios = require('axios').default;



/**
 * @class 
 * Handles all axios interactions
 */
class IndexerAxiosHandler {

    /**
    * @typedef ResponseError
    * @property {String} error - Error message
    */

    /**
     * @param {String} indexerUrl - The indexer api url to use
     * @param {Number} indexerVersion - The version of the indexer url to use. This will be appended to the indexer url as /<version>
     */
    constructor(indexerUrl, indexerVersion) {
        this.endpointBaseURL = indexerUrl + indexerVersion;
    }

    /**
     * Formats a url to the correct non prefix, trailing slash format expected by the AxiosHandler methods
     * @param {String} endpoint - The endpoint to format
     */
    _formatEndpoint(endpoint) {
        if (typeof endpoint !== "string") {
            throw new Error("Endpoint must be a string");
        }
        return endpoint[0] !== "/" ? this.endpointBaseURL + ("/" + endpoint) : this.endpointBaseURL + endpoint;
    }

    /**
     * Generate a response error
     * @param {String} msg - message to use as an error 
     * @returns {ResponseError}
     */
    _generateResponseError(msg) {
        if (typeof msg !== "string") {
            throw new Error("Response error must be a string")
        }
        return { error: msg };
    }

    /**
     * Generate get URL parameters based on array pairs of key:values. Note that keys and values are index sensitive
     * @param {Array<String>} parameters - Array of parameters to apply values to
     * @param {Array<String>} values - Array of values for parameter array
     * @returns {Array<Array>} - Two dimensional array of parameter:value pairs
     */
    _generateGetParams(parameters = [], values = []) {
        let params = [];
        for (let i = 0; i < parameters.length; i++) {
            let param = parameters[i];
            let value = values[i];
            // Only push params with values
            if (value) {
                params.push([param, value])
            }
        }
        return params;
    }

    /**
     * Apply get parameters generated from _generateGetParams to the supplied endpoint
     * @param {String} endpoint - Endpoint to apply parameters to
     * @param {Array<Array>} parameters - 2D Array of parameter:value pairs
     */
    _applyGetParamsToEndpoint(endpoint, parameters) {
        if (parameters.length > 0) {
            for (let i = 0; i < parameters.length; i++) {
                let parameterSet = parameters[i];
                endpoint += (i === 0 ? "?" : "&") + parameterSet[0] + "=" + parameterSet[1];
            }
        }
        return endpoint;
    }

    /**
     * @param {String} endpoint - The endpoint of the indexerURL to call
     * @param {Array<Array<String>>} parameters - 2D Array of parameter:value pairs eg [[limit, 20], [offset, 1]] 
     * @returns {any} - Data response from endpoint (response.data)  
     */
    async get(endpoint, parameters = []) {
        // Format Endpoint and apply get parameters if applicable
        let targetEndpoint = this._applyGetParamsToEndpoint(this._formatEndpoint(endpoint), parameters);
        try {
            return await (await axios.get(targetEndpoint)).data;
        } catch (e) {
            if (e.response && e.response.data) {
                return this._generateResponseError(e.response.data.message)
            }
            return this._generateResponseError(e.message)
        }
    }

    async post(endpoint, postOps) {}

}

module.exports = IndexerAxiosHandler;
