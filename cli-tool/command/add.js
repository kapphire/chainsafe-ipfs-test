const fs = require("fs");
const IPFS = require('ipfs-core');
const { exit } = require("process");
const Web3 = require('web3');
const bs58 = require('bs58');
const Provider = require('@truffle/hdwallet-provider');
const IPFSStorage = require("../abi/IPFSStorage.json");

require('dotenv').config();

async function add (path) {
    if (path && fs.existsSync(path)) {
        const ipfs = await IPFS.create();
        let receivedCid = '';
        try {
            const data = fs.readFileSync(path, 'utf8');
            const { cid } = await ipfs.add(data);
            receivedCid = cid;
        } catch(error) {
            console.log(error);
        }
        const infuraKey = process.env.INFURA_KEY;
        const privateKey = process.env.PRIVATE_KEY;
        const walletAddress = process.env.WALLET_ADDRESS

        const provider = new Provider(privateKey, `https://kovan.infura.io/v3/${infuraKey}`); 
        const web3 = new Web3(provider);
        const networkId = await web3.eth.net.getId();
        const contract = new web3.eth.Contract(IPFSStorage.abi, "0x5D3b2d07c3b0bBaaa602f05acFB9426Ed985154D");
        web3.eth.accounts.wallet.add(privateKey);
        const hashObj = getBytes32FromMultiash(receivedCid.toString());

        console.log(hashObj)

        const tx = contract.methods.setCID(hashObj.digest, hashObj.hashFunction, hashObj.size);
        const gas = await tx.estimateGas({from: walletAddress});
        const gasPrice = await web3.eth.getGasPrice();
        const data = tx.encodeABI();
        const nonce = await web3.eth.getTransactionCount(walletAddress);
        const txData = {
            from: walletAddress,
            to: contract.options.address,
            data: data,
            gas,
            gasPrice,
            nonce, 
            chainId: 42
        };

        try {
            const receipt = await web3.eth.sendTransaction(txData);
            console.log(receivedCid.toString());
        }
        catch(error) {
            console.log(error);
        }
        
        exit(1);
    } else {
        console.log('File not exists');
    }
}

const getBytes32FromMultiash = (multihash) => {
    const decoded = bs58.decode(multihash);
    return {
        digest: `0x${decoded.slice(2).toString('hex')}`,
        hashFunction: decoded[0],
        size: decoded[1],
    };
}

module.exports = add