import assert from "assert";
import IdxCaller from "../index.js";

const testIdxEndpoint = "https://index-frontend-sg4efdgo3q-uc.a.run.app/";
const testAddress = "0xc113189ad606c8dd46a783a7915483d7e9461c9a"
const blockId = 53000;
const indexerURL = "https://index-frontend-sg4efdgo3q-uc.a.run.app";
const endpointBaseURL = "https://index-frontend-sg4efdgo3q-uc.a.run.app";

describe("IdxCaller", function () {

    describe("Instancing Options", function () {

        const checkIdxClassState = (classInstance, versionToCheck = "/v1") => {
            assert.equal(classInstance.defaultIndexerVersion, "/v1");
            assert.equal(classInstance.indexerVersion, versionToCheck);
            assert.equal(classInstance.indexerUrl, indexerURL);
            assert.equal(classInstance.axiosHandler.endpointBaseURL, endpointBaseURL + versionToCheck);
        }

        it("Should show expected class state when instanced w/ shorthand method", function () {
            const idxCaller = new IdxCaller(testIdxEndpoint);
            checkIdxClassState(idxCaller);
        });

        it("Should show expected class state when instanced w/ config object w/out version", function () {
            const idxCallerObj1 = new IdxCaller({ indexerURL: testIdxEndpoint });
            checkIdxClassState(idxCallerObj1);
        });

        it("Should show expected class state when instanced w/ config object w/ version", function () {
            const idxCallerObj2 = new IdxCaller({ indexerURL: testIdxEndpoint, indexerVersion: 2 });
            checkIdxClassState(idxCallerObj2, "/v2");
        });
    });

    describe("Block Methods", function () {
        let idxCaller;

        beforeEach(function () {
            idxCaller = new IdxCaller(testIdxEndpoint);
        });

        const checkBlockObject = (blockObject) => {
            assert.equal(blockObject.hasOwnProperty("chainId"), true);
            assert.equal(blockObject.hasOwnProperty("height"), true);
            assert.equal(blockObject.hasOwnProperty("transactionCount"), true);
            assert.equal(blockObject.hasOwnProperty("previousBlockHash"), true);
            assert.equal(
                blockObject.hasOwnProperty("transactionRootHash"),
                true
            );
            assert.equal(blockObject.hasOwnProperty("stateRootHash"), true);
            assert.equal(blockObject.hasOwnProperty("headerRootHash"), true);
            assert.equal(
                blockObject.hasOwnProperty("groupSignatureHash"),
                true
            );
            assert.equal(blockObject.hasOwnProperty("transactionHashes"), true);
        };

        it("Should be able to get current block height", async () => {
            const currentBlockHeight = await idxCaller.getCurrentBlockHeight();
            assert.equal("number", typeof currentBlockHeight);
        });
        
        it("Should be to get list of block heights without limit or offset", async () => {
            const blocks = await idxCaller.getBlockHeights();
            assert.equal(blocks.length > 0, true);
        });

        let firstBlockHeight;

        it("Should be able to get list of block heights with just limit", async () => {
            const blocks = await idxCaller.getBlockHeights(1);
            assert.equal(blocks.length, 1);
            firstBlockHeight = blocks[0];
        });

        it("Should be able to get list of block heights with just offset", async () => {
            const blocks = await idxCaller.getBlockHeights(false, 1);
            assert.equal(blocks.length > 0, true);
            assert.notEqual(blocks[0], firstBlockHeight);
        });

        it("Should be able to get list of block heights with both limit and offset", async () => {
            const blocks = await idxCaller.getBlockHeights(10, 1);
            assert.equal(blocks.length > 0, true);
            assert.equal(blocks.length, 10);
        });

        it("Should be able to to get current block", async () => {
            const currentBlock = await idxCaller.getCurrentBlock();
            checkBlockObject(currentBlock);
        });

        it("Should be able to to get a block by number", async () => {
            const polledBlock = await idxCaller.getBlock(blockId);
            checkBlockObject(polledBlock);
        });

    });

       
    describe("Transaction Methods", function () {

        let idxCaller;

        beforeEach(function () {
            idxCaller = new IdxCaller(testIdxEndpoint);
        });

        it("Should be able to get latest transactions", async () => {
            const latestTxs = await idxCaller.getTransactions();
            assert(latestTxs.length > 0, true);
        });

        it("Should be able to get latest transactions for specific address", async () => {
            const latestTxs = await idxCaller.getTransactionsForAddress(testAddress);
            assert(latestTxs.length > 0, true);
        });

        it("Should be able to get latest transactions for current block", async () => {
            const currentBlock = await idxCaller.getCurrentBlock();
            currentBlock.transactionHashes.forEach(async hash => {
                const tx = await idxCaller.getTransactionByHash(hash);
                assert(Boolean(tx?.transaction), true);
            });
        });

        it("Should be able to get transactions from a specific block", async () => {
            const polledBlock = await idxCaller.getBlock(blockId);
            polledBlock.transactionHashes.forEach(async hash => {
                const tx = await idxCaller.getTransactionByHash(hash);
                assert(Boolean(tx?.transaction), true);
            });
        });
    });

    describe("Datastore Methods", function() {

        let idxCaller;

        beforeEach(function () {
            idxCaller = new IdxCaller(testIdxEndpoint);
        });

        it("Should be able to get datastores for an address", async () => {
            const datastores = await idxCaller.getDataStoresForAddress(testAddress);
            assert(datastores.length > 0, true);
        });
        
        it("Should be able to get datastore by index for an address", async () => {
            const datastores = await idxCaller.getDataStoresForAddressAndIndex(testAddress, "1");
            assert(datastores.length > 0, true);
        });

    });

});

 