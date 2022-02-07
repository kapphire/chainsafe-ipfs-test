import type { Arguments, CommandBuilder } from 'yargs';
import fs from "fs";
import * as IPFS from 'ipfs-core';
import Web3 from 'web3';
import bs58 from 'bs58';
import Provider from '@truffle/hdwallet-provider';
import IPFSStorage from "../abi/IPFSStorage.json";

require('dotenv').config();

type Options = {
  name: string;
};

export const command: string = 'add <path>';
export const desc: string = 'add <path>';

export const builder: CommandBuilder<Options> = (yargs) =>
  yargs
    .positional('path', { type: 'string', demandOption: true });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { path } = argv;
  const filePath:any = path;
  if (filePath && fs.existsSync(filePath)) {
    const ipfs = await IPFS.create();
    let receivedCid:any = '';
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const { cid } = await ipfs.add(data);
        receivedCid = cid;
    } catch(error) {
        console.log(error);
    }
    const infuraKey:any = process.env.INFURA_KEY;
    const privateKey:any = process.env.PRIVATE_KEY;
    const abi:any = IPFSStorage;

    const provider = new Provider(privateKey, `https://kovan.infura.io/v3/${infuraKey}`); 
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(abi, '0xEB46fe251D5864bF654770e841f061bbC0DD67e6');
    web3.eth.accounts.wallet.add(privateKey);
    const hashObj = getBytes32FromMultiash(receivedCid.toString());

    const tx = contract.methods.setCID(hashObj.digest, hashObj.hashFunction, hashObj.size);
    const gas = await tx.estimateGas({from: '0xB943A92616da4fc73dA3Ea47A0521E23DB41d09e'});
    const gasPrice = await web3.eth.getGasPrice();
    const data = tx.encodeABI();
    const nonce = await web3.eth.getTransactionCount('0xB943A92616da4fc73dA3Ea47A0521E23DB41d09e');
    const txData = {
        from: '0xB943A92616da4fc73dA3Ea47A0521E23DB41d09e',
        to: contract.options.address,
        data: data,
        gas,
        gasPrice,
        nonce, 
        chainId: 42
    };

    try {
        await web3.eth.sendTransaction(txData);
        console.log(receivedCid.toString());
    }
    catch(error) {
        console.log(error);
    }
  } else {
      console.log('File does not exist!');
  }
  process.exit(0);
};

export const getBytes32FromMultiash = (multihash: string) => {
  const decoded = bs58.decode(multihash);
  return {
      digest: `0x${decoded.slice(2).toString('hex')}`,
      hashFunction: decoded[0],
      size: decoded[1],
  };
}
