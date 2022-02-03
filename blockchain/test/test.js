const { expect } = require("chai");
const { ethers } = require("hardhat");

const CID = {
    digest: '0x261d542c4021fb287ac1467153991128bba59932dd9cdfe9fbc6ac164dafcc28',
    hashFunction: 18,
    size: 32
}

describe("IPFSStorage", function () {
  it("Should return the new hash once it's changed", async () => {
    const IPFSStorage = await ethers.getContractFactory("IPFSStorage");
    const ipfsStorage = await IPFSStorage.deploy();
    await ipfsStorage.deployed();

    const setCIDTx = await ipfsStorage.setCID(CID.digest, CID.hashFunction, CID.size);

    const cid = await ipfsStorage.getCID()

    expect(cid.digest).to.equal(CID.digest);
    expect(cid.hashfunction).to.equal(CID.hashFunction);
    expect(cid.size).to.equal(CID.size);
  });
});