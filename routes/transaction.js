const express = require('express');
const { provider } = require('../lib/ethereum');

const router = express.Router();

router.get('/:transactionHash', async (req, res) => {
    const transaction = await provider.getTransaction(req.params.transactionHash);
    res.json(200, transaction);
});

router.get('/:transactionHash/receipt', async (req, res) => {
    const transactionReceipt = await provider.getTransactionReceipt(req.params.transactionHash);
    res.json(200, transactionReceipt);
});

module.exports = router;
