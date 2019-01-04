const express = require('express');
const jsonBignum = require('json-bignum');
const { validate } = require('../lib/orderValidator');

const router = express.Router();

router.post('/order', async (req, res) => {
    const parsedBody = jsonBignum.parse(req.rawBody);

    const {
        signature,
        orderHash,
        rawData: {
            makerAddress,
            makerSellTokenAddress,
            makerSellTokenAmount,
            makerBuyTokenAddress,
            makerBuyTokenAmount,
            nonce,
            exchangeAddress,
        },
    } = parsedBody;

    const responseData = validate(
        signature,
        orderHash,
        makerAddress,
        makerSellTokenAddress,
        makerSellTokenAmount,
        makerBuyTokenAddress,
        makerBuyTokenAmount,
        nonce,
        exchangeAddress
    );

    res.status(200).json(responseData);
});

module.exports = router;
