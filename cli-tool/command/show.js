const { exit } = require("process");
const Web3 = require('web3');
const bs58 = require('bs58');
const IPFSStorage = require("../abi/IPFSStorage.json");

require('dotenv').config();

async function show() {

        const infuraKey = process.env.INFURA_KEY;

        const provider = new Web3.providers.HttpProvider(`https://kovan.infura.io/v3/${infuraKey}`);
        const web3 = new Web3(provider);
        const networkId = await web3.eth.net.getId();
        const contract = new web3.eth.Contract(IPFSStorage.abi, "0x5D3b2d07c3b0bBaaa602f05acFB9426Ed985154D");

        contract.methods.getCID().call().then((res) => {
            console.log(getMultihashFromBytes32(res));
            exit(1);
        });
}

const getMultihashFromBytes32 = (multihash) => {
    const { digest, hashfunction, size } = multihash;
    if (size === 0) return null;

    // cut off leading "0x"
    const hashBytes = Buffer.from(digest.slice(2), 'hex');

    // prepend hashfunction and digest size
    const multihashBytes = new (hashBytes.constructor)(2 + hashBytes.length);
    multihashBytes[0] = parseInt(hashfunction);
    multihashBytes[1] = parseInt(size);
    multihashBytes.set(hashBytes, 2);

    return bs58.encode(multihashBytes);
}

module.exports = show