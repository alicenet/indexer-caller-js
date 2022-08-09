const IdxCaller = require('./src/IdxCaller/IdxCaller');
module.exports = IdxCaller;

let idxCaller = new IdxCaller("https://index-frontend-sg4efdgo3q-uc.a.run.app/");

// mainTest();
async function mainTest() {

    let testAddress = "0xc113189ad606c8dd46a783a7915483d7e9461c9a"

    console.log("Using IDX Caller:\n")
    console.log(idxCaller);

    console.log("\n");

    console.log("getCurrentBlockHeight");async function mainTest() {

        let testAddress = "0xc113189ad606c8dd46a783a7915483d7e9461c9a"
    
        console.log("Using IDX Caller:\n")
        console.log(idxCaller);
    
        console.log("\n");
    
        console.log("getCurrentBlockHeight");
        let currentBlockHeight = await idxCaller.getCurrentBlockHeight();
        console.log(currentBlockHeight);
    
        console.log("\n")
    
        console.log("getCurrentBlock");
        let currentBlock = await idxCaller.getCurrentBlock();
        console.log(currentBlock);
    
        console.log("\n")
    
        console.log("getBlock");
        let polledBlock = await idxCaller.getBlock(53000);
        console.log(polledBlock);
    
        console.log("\n")
    
        console.log("getBlockHeights");
        let blocks = await idxCaller.getBlockHeights();
        console.log(blocks);
    
        console.log("\n");
    
        console.log("getBlockHeights with limit/offset");
        let blockslimitoff = await idxCaller.getBlockHeights(10, 2);
        console.log(blockslimitoff);
    
        console.log("\n");
    
        console.log("getLatestTransactions");
        let txs = await idxCaller.getTransactions(10, 2);
        console.log(txs);
    
        console.log("\n")
    
        console.log("getTransactionsForAddress");
        let txsForAddress = await idxCaller.getTransactionsForAddress(testAddress, 10, 2);
        console.log(txsForAddress);
    
        console.log("\n")
    
        console.log("getBalanceForAddress");
        let balance = await idxCaller.getBalanceForAddress(testAddress);
        console.log(balance);
    
        console.log("\n")
    
        console.log("getDataStoresForAddress");
        let dataStores = await idxCaller.getDataStoresForAddress(testAddress);
        console.log(dataStores);
    
        console.log("\n")
    
        console.log("getTransactionByHash");
        let tx = await idxCaller.getTransactionByHash("0845d0afcb20888bb4eb4568d086ccce92843f57684230f22fa25c298bbe5803");
        console.log(tx)
    }
    
    
    

    console.log("getCurrentBlock");
    let currentBlock = await idxCaller.getCurrentBlock();
    console.log(currentBlock);

    console.log("\n")

    console.log("getBlock");
    let polledBlock = await idxCaller.getBlock(53000);
    console.log(polledBlock);

    console.log("\n")

    console.log("getBlockHeights");
    let blocks = await idxCaller.getBlockHeights();
    console.log(blocks);

    console.log("\n");

    console.log("getBlockHeights with limit/offset");
    let blockslimitoff = await idxCaller.getBlockHeights(10, 2);
    console.log(blockslimitoff);

    console.log("\n");

    console.log("getLatestTransactions");
    let txs = await idxCaller.getTransactions(10, 2);
    console.log(txs);

    console.log("\n")

    console.log("getTransactionsForAddress");
    let txsForAddress = await idxCaller.getTransactionsForAddress(testAddress, 10, 2);
    console.log(txsForAddress);

    console.log("\n")

    console.log("getBalanceForAddress");
    let balance = await idxCaller.getBalanceForAddress(testAddress);
    console.log(balance);

    console.log("\n")

    console.log("getDataStoresForAddress");
    let dataStores = await idxCaller.getDataStoresForAddress(testAddress);
    console.log(dataStores);

    console.log("\n")

    console.log("getTransactionByHash");
    let tx = await idxCaller.getTransactionByHash("0845d0afcb20888bb4eb4568d086ccce92843f57684230f22fa25c298bbe5803");
    console.log(tx)
}


