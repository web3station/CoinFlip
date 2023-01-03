# CoinFlip challenge

Solve [Eternaut CoinFlip Challenge](https://ethernaut.openzeppelin.com/level/3). The simplest solution is to deploy a contract with a function that calculates the expected coin flip using the same algorithm as the flip function and then calls CoinFlip contract with the expected result. There are several documented solutions online: [solution1](https://www.goodbytes.be/article/ethernaut-walkthrough-level-3-coin-flip) or [solution2](https://hackernoon.com/how-to-solve-the-level-3-of-the-ethernaut-game). But I wanted to hack CoinFlip directly off-chain without deploying any extra contract.

This works fine on local environment but not always easy to use on a public testnet as you are not 100% certain that your transactions will be included by the miners in the correct block.

Run `yarn` to install dependencies.

## Hack `CoinFlip` locally

- Compile the contracts

  ```sh
  yarn compile
  ```

- Start a local blockchain network

  ```sh
  yarn start-node
  ```

- Deploy `CoinFlip` contract

  ```sh
  yarn deploy-coinflip
  ```

  ```sh
  yarn deploy-coinflip
  yarn run v1.22.19
  $ npx hardhat run scripts/deploy-coinFlip.ts
  CoinFlip address 0x5FbDB2315678afecb367f032d93F642f64180aa3
  ```

- Note the address
- Hack the contract by running the `flip` script

  ```sh
  yarn flip <your-address>
  ```

  ```sh
  yarn flip 0x5FbDB2315678afecb367f032d93F642f64180aa3
  yarn run v1.22.19
  $ npx hardhat flip --coinflip 0x5FbDB2315678afecb367f032d93F642f64180aa3
  consecutive wins(start) 0
  guess true
  0x56ec7c042974a65862a20af396eb35ec960af2df28d338d393a0a9b56006b08d
  consecutive wins(current) 1
  guess false
  0x986ce7498dc06a5d13af29aea101c177bde70c35069d2e37c55a06c70bc6c058
  consecutive wins(current) 2
  guess false
  0x666cde983f0653f0258849a46ef7498403df16783a5ad0057d10b5af5e16d0a0
  consecutive wins(current) 3
  guess true
  0x23ed8d1dd7b8f5e5baedc7ff0e28d7f628065d1ab7ad9bc1a03bb4a74ac62c78
  consecutive wins(current) 4
  guess true
  0xbec2890299c2e26f66a19ebd1614f807efa8c54371bc417658d90fcff7d7b62c
  consecutive wins(current) 5
  guess true
  0xc92a4081c0a5a5de50c1ef4eb195e4265f448046184ddfb976d8692a35480dc4
  consecutive wins(current) 6
  guess true
  0x1ed446ead8e7121b64f220db689743be1faca6285da94855d9cb62a88761742a
  consecutive wins(current) 7
  guess true
  0x98c45d26337b15e9a3f822d02573645cad577cfb4b15ed6a2cafca64b1287496
  consecutive wins(current) 8
  guess false
  0x06496e8f5a593acd526fbfd4d1596764700ecb298b2e2f5103c619778930e6d7
  consecutive wins(current) 9
  guess true
  0xef96401c27d724c1a391a83e3ced207062fd1b223a08972fb4a13734f277cf06
  consecutive wins(current) 10
  you won!
  ✨  Done in 8.29s.
  ```
