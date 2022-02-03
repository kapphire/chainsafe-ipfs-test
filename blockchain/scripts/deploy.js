const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const IPFSStorage = await hre.ethers.getContractFactory("IPFSStorage");
  const ipfsStorage = await IPFSStorage.deploy();

  await ipfsStorage.deployed();

  console.log("IPFSStorage deployed to:", ipfsStorage.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });