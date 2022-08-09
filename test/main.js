const assert = require('assert');
const IdxCaller = require('../index.js');

let idxCaller; // idxCaller to be instanced here
let testIdxEndpoint = "https://index-frontend-sg4efdgo3q-uc.a.run.app/";
let testAddress = "0xc113189ad606c8dd46a783a7915483d7e9461c9a"

describe('IdxCaller', function () {

    describe('Instancing Options', function () {

        const checkIdxClassState = (classInstance, versionToCheck = "/v1") => {
            assert.equal(classInstance.defaultIndexerVersion, '/v1');
            assert.equal(classInstance.indexerVersion, versionToCheck);
            assert.equal(classInstance.indexerUrl, 'https://index-frontend-sg4efdgo3q-uc.a.run.app');
            assert.equal(classInstance.axiosHandler.endpointBaseURL, "https://index-frontend-sg4efdgo3q-uc.a.run.app" + versionToCheck);
        }

        it('Should show expected class state when instanced w/ shorthand method', function () {
            idxCaller = new IdxCaller(testIdxEndpoint);
            checkIdxClassState(idxCaller);
        });

        it('Should show expected class state when instanced w/ config object w/out version', function () {
            let idxCallerObj1 = new IdxCaller({ indexerURL: testIdxEndpoint });
            checkIdxClassState(idxCallerObj1);
        });

        it('Should show expected class state when instanced w/ config object w/ version', function () {
            let idxCallerObj2 = new IdxCaller({ indexerURL: testIdxEndpoint, indexerVersion: 2 });
            checkIdxClassState(idxCallerObj2, "/v2");
        });

    });

    describe("Block Methods", function () {

        const checkBlockObject = (blockObject) => {
            assert.equal(blockObject.hasOwnProperty("chainId"), true)
            assert.equal(blockObject.hasOwnProperty("height"), true)
            assert.equal(blockObject.hasOwnProperty("transactionCount"), true)
            assert.equal(blockObject.hasOwnProperty("previousBlockHash"), true)
            assert.equal(blockObject.hasOwnProperty("transactionRootHash"), true)
            assert.equal(blockObject.hasOwnProperty("stateRootHash"), true)
            assert.equal(blockObject.hasOwnProperty("headerRootHash"), true)
            assert.equal(blockObject.hasOwnProperty("groupSignatureHash"), true)
            assert.equal(blockObject.hasOwnProperty("transactionHashes"), true)
        };

        it("Should be able to get current block height", async () => {
            let currentBlockHeight = await idxCaller.getCurrentBlockHeight();
            assert.equal("number", typeof currentBlockHeight);
        })
        
        it("Should be to get list of block heights without limit or offset", async () => {
            let blocks = await idxCaller.getBlockHeights();
            assert.equal(blocks.length > 0, true);
        });

        let firstBlockHeight;

        it("Should be able to get list of block heights with just limit", async () => {
            let blocks = await idxCaller.getBlockHeights(1);
            assert.equal(blocks.length, 1);
            firstBlockHeight = blocks[0]
        });

        it("Should be able to get list of block heights with just offset", async () => {
            let blocks = await idxCaller.getBlockHeights(false, 1);
            assert.equal(blocks.length > 0, true);
            assert.notEqual(blocks[0], firstBlockHeight);
        });

        it("Should be able to get list of block heights with both limit and offset", async () => {
            let blocks = await idxCaller.getBlockHeights(10, 1);
            assert.equal(blocks.length > 0, true);
            assert.equal(blocks.length, 10);
        });
        
        it("Should be able to to get current block", async () => {
            let currentBlock = await idxCaller.getCurrentBlock();
            checkBlockObject(currentBlock);
        });

        it("Should be able to to get a block by number", async () => {
            let polledBlock = await idxCaller.getBlock(53000);
            checkBlockObject(polledBlock)
        });

    })

    

});

describe("Transaction Methods", function() {
    it("Should be able to get latest transactions", async () => {
        let latestTxs = await idxCaller.getTransactions();
        assert(latestTxs.length > 0, true);
    });

    // TBD below, not implemented yet
    it("Should be able to get latest transactions for specific address", async () => {

    });

    it("Should be able to get latest transactions for current block", async () => {
        // method needs written -- use blocks.transactions
    });

    it("Should be able to get transactions from a specific block", async () => {
        // method needs written -- use blocks.transactions
    });
});

describe("Datastore Methods", function() {

    // TBD below, not implemented yet
    it("Should be able to get datastores for an address", async () => {

    });

    it("Should be able to get datastore by index for an address", async () => {
        
    })

});