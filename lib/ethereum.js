const ethers = require('ethers');

// Default provider URL is the same as the one on staging
const providerUrl = process.env.ETHEREUM_URL;
const provider = new ethers.providers.JsonRpcProvider(providerUrl);

module.exports = { ethers, provider };
