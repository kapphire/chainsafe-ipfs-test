import type { CommandBuilder } from 'yargs';
import Web3 from 'web3';
import bs58 from 'bs58';
import IPFSStorage from "../abi/IPFSStorage.json";

export const command: string = 'show';
export const desc: string = 'show';

export const builder: CommandBuilder = (yargs) =>
  yargs;

export const handler = async (): Promise<void> => {
  const infuraKey:any = process.env.INFURA_KEY;
  const abi:any = IPFSStorage;

  const provider = new Web3.providers.HttpProvider(`https://kovan.infura.io/v3/${infuraKey}`);
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(abi, '0xEB46fe251D5864bF654770e841f061bbC0DD67e6');

  await contract.methods.getCID().call().then((res: any) => {
    console.log(getMultihashFromBytes32(res));
  });

  process.exit(0);
};

export const getMultihashFromBytes32 = (multihash: { digest: any; hashfunction: any; size: any; }) => {
  const { digest, hashfunction, size } = multihash;
  if (size === 0) return null;

  // cut off leading "0x"
  const hashBytes:any = Buffer.from(digest.slice(2), 'hex');

  // prepend hashfunction and digest size
  const multihashBytes = new (hashBytes.constructor)(2 + hashBytes.length);
  multihashBytes[0] = parseInt(hashfunction);
  multihashBytes[1] = parseInt(size);
  multihashBytes.set(hashBytes, 2);

  return bs58.encode(multihashBytes);
}