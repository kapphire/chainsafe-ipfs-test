### IPFS Upload & Contract Registry


#### Smart Contract

1. how to deploy?
- change `..\chainsafe-test\blockchain\example.env` to `.env`
- replace your keys in `.env`
- install all dependencies in `\chainsafe\blockchain` directory
- `..\chainsafe-test\blockchain$ npx hardhat run scripts/deploy.js`

2. Run test
- `..\chainsafe-test\blockchain$ npx hardhat test`

3. opinion
- We are able to store CID in 3 ways - `string`, `bytes32` and by emitting `event`.
- From the transaction fee standpoint, `bytes32` requires less fees than `string`. So I store the CID as `bytes32`.
- Note: In my opinion, emitting `event` is the best way to store CID (fee is less than even `bytes32` type)
- We are able to use `subgraph` to query (fetch) CID using `graphql`. (We can discuss more about it)

#### cli tool

1. how to install
- Go to `cli-tool` directory.
- Change env.example to .env in `cli-tool` directory, replace the env variables with yours.
- Install all dependencies in package.json file.
- Build `npx tsc`
- Run `npm install -g ./`

2. cli explain
- there are 2 commands - `chainsafe add <filepath>`, `chainsafe show`
- `chainsafe add <filepath>` is used to upload file to ipfs and then store the CID in a smart contract.
- `chainsafe show` is used to fetch CID in a smart contract to ensure that it's stored correctly.