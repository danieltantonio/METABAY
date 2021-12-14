# METABAY

![](https://i.imgur.com/qK3OCy2.png)
(Picture is temporary lol)

## How To Set Up:
1.) Install the Truffle Development Environment:

```
npm i -g truffle
```

2.) Clone the project:

```
git clone git@github.com:danieltantonio/web3-test-store.git
```

3.) Change Directory into the `client` and `server` directories and install the necessary local packages:

```
cd web3-test-store
cd client
npm i
cd ..
cd server
npm i
```

4.) Create a `.env` file in the `server` directory

5.) Inside the `.env` file, create a `DB_URL` variable equal to your Mongo Database:

```
DB_URL = (your mongodb connection link here...)
```

6.) Inside the `.env` file, create a `SESSION_SECRET` variable equal to whatever you want it to be:

```
SESSION_SECRET = D347hGr1p5
```

7.) Assuming you already have a terminal open, you might want to open two more.

8.) In the first Terminal, start the Truffle Development Server in the `client` directory:

```
truffle dev
```

9.) Still in the first Terminal, after the Development Server has fully loaded, Migrate the contracts

```
migrate
```

10.) In the second Terminal, `cd` into the `server` directory and start the express server:

```
npm start
```

11.) In the third Terminal, `cd` into the `client` directory and start the react server:

```
npm start
```

(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ You are good to go~!!! 

## So Uhh... What is it (´･ω･`)?

### In Short...
The METABAY is an e-commerce web app where users can buy or sell products for Ethereum. That's about it really. 

### The Long Answer...
The METABAY is a decentralized marketplace that is ran on the Ethereum Blockchain Network, where users can trade almost anything for Ethereum. When these Items are put up for sale, a new Smart Contract is deployed. When users buy these Items, the seller ships this Item to the buyer and the trade is complete... but that's not all. When the buyer, does buy an item, the Smart Contract for said Item shows proof of purchase and ownership of the item to the buyer, thus becoming the new Owner of that Contract. Basically, these everyday items for sale become, *in a way*, In-Real-Life NFTs (Non-Fungible-Tokens).

What makes The METABAY more of an E-Commerce App rather than an NFT Marketplace is that, people can sell pretty much anything (including NFTs). Unless there is something that makes your Gucci sunglasses for sale unique in some sort of way, **IT IS NOT TRULY** an NFT.

In the end, the buyer is happy with their new product and can brag to their friends and family how they bought their new luxury sunglasses using Crypto. And the seller is happy that they made money and that they set or strengthened their position in Ethereum.

## Why Make The METABAY?

### The Short Answer...
Because I can! >:D

### The Long Answer...
- To study how blockchain technology works.
- To get ahead in the new era of Web 3.0
- To make a fullstack application.
- To have another thing on my resume.
- To learn a new programming language.
- To kill time as I'm job hunting.
- To help pave the way to a more decentralized internet and in turn, a more decentralized world.
- Because I can... >:D