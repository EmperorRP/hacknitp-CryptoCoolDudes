# Rapid Ticket Marketplace

A ticket booking platform where organizations can generate their own tickets or customers can buy the tickets. These tickets will contain information about the seat number, price, names etc. Every ticket is unique and hence it is Non-Fungible. We are trying to use the fact that these tickets can be treated as NFTs and be bought, sold and traded on our platform. The setup is in 3 very simple steps and we make it so that it is extremely fast, reliable and very easy. The tickets can also be generated and bought in mass. This is all done with the help of trade of Ether(ETH) and could be backed by Polygon and Ethereum. 

Submission Links:

Presentation: https://www.canva.com/design/DAE4On68Pvw/MaXwYBJIVvcvdBma45Tvhw/view?utm_content=DAE4On68Pvw&utm_campaign=designshare&utm_medium=link&utm_source=sharebutton
Video: https://www.youtube.com/watch?v=aUUva2DtmWo&ab_channel=SaiLeelaRahulPujari


## Use Cases
```
#1
I want to book tickets for an event, I can go to the RTM site and book the tickets 
directly and very quickly from there. I am not spending money but I am spending ETH to do so.

#2
AS A person interested in the digital ticketing system and NFTs
I WANT to generate/buy tickets
SO THAT I can book/host events AND use the tickets as NFTs

#3
A famous person, let's say Elon Musk bought a ticket on this platform. Because of Elon Musk's global brand and fame, he can decide to sell this ticket for a high price. So he can use the RTM web application to sell off his ticket as an NFT which sells for a lot of eth. 

#4
I am an organization that wants to generate mass tickets for an event I am organizing soon. I can very easily generate tickets in mass. This makes it easy for me to host events whenever I want for whatever I need.
```

## Problems we faced
- Finishing on time was the biggest hurdle we faced. Although everything was sorted out, we found it hard to finish the project as one app in time.
- GitHub merging and conflict resolution took time to figure out.
- Problems related to Mass Upload contracts
- Problems related to uploading and parsing CSV file
- Problems in getting the IPFSS to work and store the data properly
- Problems to get the local blockchain to work properly
- Front-end linking to Back-end took some time to figure out as well.

## Techstack
IPFS, HTML, CSS, Infura, JavaScript, TailwindCSS, Hardhat, TypeScript, Papaparse, ethers.js, web3

## Contracts Deployed on the MATIC Test Net

> nftmarketaddress = "0x7C7Bf38A9f256EcE15c124f465f16c3C89f15AA7"

> nftaddress = "0xc291AAA396a9ABA4457795056794341bF6D0816c"

## Prerequisites

Node.js installed on your machine

Metamask wallet extension installed as a browser extension

## How to deploy application

install packages
```shell
npm install
```

Open 2 Terminals

In the first one run
```shell
npx hardhat node
```

In the seceond one run
```bash

npx hardhat run scripts/deploy.js --network localhost

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Select Localhost on metamask for the wallet to be able to interact with the site

## To check contract deployed on mainnet


Open 2 Terminals

In the first one run
```shell
npx hardhat node
```

In the seceond one run

If you want to create a new node else ignore
```bash
npx hardhat run scripts/deploy.js --network mumbai
```

```bash
npm run dev
```
### Changing files
Change config.js (In case you want to acesss old Contract) to
```bash
  export const nftmarketaddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  export const nftaddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
```

Change pages\index.js from
```bash
  let rpcEndpoint = ""
```
to
```bash
  let rpcEndpoint = "https://rpc-mainnet.maticvigil.com"
```
