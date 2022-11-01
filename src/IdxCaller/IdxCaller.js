import AxiosHandler from "../AxiosHandler/AxiosHandler.js";
import { removeTrailingSlash } from "../util/string.js";

/**
 * Index Caller is responsible for calling common end points on the AliceNet Indexer
 * It will always return the data requested or an object with an error field
 * eg getCurrentBlockHeight Success = 201, but a failure equals {error: "MSG"}
 * @class
 */
export default class IdxCaller {
    /**
     * @typedef ConfigObject - Configuration object for IdxCaller
     * @property {String} indexerURL - The indexer URL
     * @property {Number} indexerVersion - The indexer version to use :: Defaults to 1
     */

    /**
     * @typedef TxData - Transaction data returned from the indexer
     */

    /**
     * @typedef BlockData - BlockData returned from the Indexer
     * @property {Number} chainId - The chain id of the chain the block belongs to
     * @property {Number} height - The block height / number of the block
     * @property {String} transactionCount - The amount of transactions in the block
     * @property {String} previousBlockHash - The previous block height's block hash
     * @property {String} transactionRootHash - The transaction root hash of the block
     * @property {String} stateRootHash - The state root hash of the block
     * @property {String} headerRootHash - The header root hash of the block
     * @property {String} groupedSignatureHash - The group signature hash of the block
     * @property {Array<String>}transactionHashes - A list of transaction hashes included in the block
     */

    /**
     * @param {ConfigObject | String} configObjectOrIndexerURL - Config Object or Quick Init with IndexerURL
     * @property configObjectOrIndexerURL.indexerURL - Indexer URL
     * @property configObjectOrIndexerURL.indexerVersion - Indexer version to use
     * @returns {null}
     */
    constructor(configObjectOrIndexerURL) {
        if (!configObjectOrIndexerURL) {
            throw new Error(
                "A configuration object or the indexerURL must be passed to the constructor of IdxCaller"
            );
        }
        this.axiosHandler;
        this.indexerUrl;
        this.indexerVersion;
        this.defaultIndexerVersion = "/v1";
        this._init(configObjectOrIndexerURL);
    }

    /**
     * Initializes the idx color by configuration object, or by shorthand instancing via the indexerURL
     * - Note that when using shorthand instancing the default indexer version will be used
     * @param {*} configObjectOrIndexerURL
     * @returns {null}
     */
    _init(configObjectOrIndexerURL) {
        // Quick Init
        if (typeof configObjectOrIndexerURL === "string") {
            this.indexerUrl = removeTrailingSlash(configObjectOrIndexerURL);
            this.indexerVersion = this.defaultIndexerVersion;
        }
        // Configuration object initialization
        else {
            const configObj = configObjectOrIndexerURL;

            // Verify and set indexerUrl
            if (
                !configObj.indexerURL ||
                typeof configObj.indexerURL !== "string"
            ) {
                throw new Error("indexerURL must exist and must be a string");
            }
            this.indexerUrl = removeTrailingSlash(configObj.indexerURL);

            // Verify and set index or version
            if (
                configObj.indexerVersion &&
                typeof configObj.indexerVersion !== "number"
            ) {
                throw new Error("indexerVersion must be a number");
            }
            this.indexerVersion = configObj.indexerVersion
                ? "/v" + String(configObj.indexerVersion)
                : this.defaultIndexerVersion;
        }
        this.axiosHandler = new AxiosHandler(
            this.indexerUrl,
            this.indexerVersion
        );
    }

    /**
     * A parameter checking method to provide easily identifiable errors for method calls
     * Note that this method allows parameters to be undefined unless required is marked as true
     * @param {String} typeAsString - Javascript type as string
     * @param {String} parameterName - The name of the parameter
     * @param {any} parameter - The parameter to check
     * @returns {null}
     */
    _paramCheck(typeAsString, parameterName, parameter, required = false) {
        // Allow undefined for non-provided params
        if (
            typeof parameter === "undefined" ||
            (typeof parameter === "boolean" && !required)
        ) {
            return;
        }
        if (typeof parameter !== typeAsString.toLowerCase()) {
            throw new Error(
                `${parameterName}'s type (${typeof parameter}) does not match expected type ${typeAsString}'`
            );
        }
    }

    /**
     * Fetch balance for a given address
     * @method
     * @param {String} address - The address to get the balance for
     * @returns {String} - The balance for the provided address
     */
    async getBalanceForAddress(address) {
        let res = await this.axiosHandler.get(
            "/addresses/" + address + "/balance"
        );
        return res.error ? res : res.balance;
    }

    /**
     * Fetches a block by block height
     * @method
     * @param {Number} blockHeight
     * @returns {BlockData} - The block object containing all block data
     */
    async getBlock(blockHeight) {
        this._paramCheck("number", "blockHeight", blockHeight);
        let res = await this.axiosHandler.get("/blocks/" + blockHeight);
        return res.error ? res : res.block;
    }

    /**
     * Return an array of block heights starting with the latest
     * @method
     * @param { Number | Boolean } limit - Limit of block heights to fetch -- provide false for no limit
     * @param { Number } offset - Offset of the block heights to fetch
     * @returns {Promise<Array<Number>>}
     */
    async getBlockHeights(limit, offset) {
        this._paramCheck("number", "limit", limit);
        this._paramCheck("number", "offset", offset);
        let params = this.axiosHandler._generateGetParams(
            ["limit", "offset"],
            [limit ? limit : null, offset]
        );
        let res = await this.axiosHandler.get("/blocks", params);
        return res.error ? res : res.heights;
    }

    /**
     * Gets the current block from the indexer
     * @method
     * @returns {BlockData} - The current block
     */
    async getCurrentBlock() {
        let currentBlockHeight = await this.getCurrentBlockHeight();
        if (currentBlockHeight.error) {
            return currentBlockHeight;
        }
        let res = await this.getBlock(currentBlockHeight);
        return res.error ? res : res;
    }

    /**
     * Gets the current block height from the indexer
     * @method
     * @returns {Number}
     */
    async getCurrentBlockHeight() {
        let currentHeight = await this.getBlockHeights(1);
        if (currentHeight.error) {
            return currentHeight;
        } else {
            return currentHeight[0];
        }
    }

    /**
     * Fetches data stores for the provided address
     * @method
     * @param {String} address - The address to get data stores for
     */
    async getDataStoresForAddress(address) {
        return await this.axiosHandler.get('/addresses/' + address + '/stores');
    }

    /**
     * Get transactions from the indexer, ambiguous of any addresses
     * @method
     * @param { Number | Boolean } limit - Limit of transactions to fetch -- provide false for no limit
     * @param { Number } offset - Offset of the transactions to fetch
     * @returns { Promise<Array<String>>} - Returns an array of Transaction Hashes
     */
    async getTransactions(limit, offset) {
        this._paramCheck("number", "limit", limit);
        this._paramCheck("number", "offset", offset);
        let params = this.axiosHandler._generateGetParams(
            ["limit", "offset"],
            [limit ? limit : null, offset]
        );
        let res = await this.axiosHandler.get("/transactions", params);
        return res.error ? res : res.transactionHashes;
    }

    /**
     * Fetches a transaction by the given hash
     * @method
     * @param {String} txHash - The transaction hash to fetch information on
     * @returns {TxData} - The transaction object from the indexer
     */
    async getTransactionByHash(txHash) {
        this._paramCheck("string", "txHash", txHash, true);
        let res = await this.axiosHandler.get('/transactions/' + txHash);
        return res;
    }

    /**
     * Get transactions from the indexer, ambiguous of any addresses
     * @method
     * @param {String} address - The address to get transactions for
     * @param { Number | Boolean } limit - Limit of transactions to fetch -- provide false for no limit
     * @param { Number } offset - Offset of the transactions to fetch
     * @returns { Promise<Array<String>>} - Returns an array of Transaction Hashes
     */
    async getTransactionsForAddress(address, limit, offset) {
        this._paramCheck("number", "limit", limit);
        this._paramCheck("number", "offset", offset);
        const params = this.axiosHandler._generateGetParams(
            ["limit", "offset"],
            [limit ? limit : null, offset]
        );
        const res = await this.axiosHandler.get(
            "/addresses/" + address + "/transactions",
            params
        );
        return res.error ? res : res.transactionHashes;
    }

    /**
     * Fetches data stores for the provided address and index
     * @method
     * @param {String} address - The address to get data stores for 
     * @param {String} index - The index to get data stores for 
     */
        async getDataStoresForAddressAndIndex(address, index) {
        const res = await this.axiosHandler.get('/addresses/' + address + '/stores/' + index);
        return res.error ? res : res.value; 
    }
}
