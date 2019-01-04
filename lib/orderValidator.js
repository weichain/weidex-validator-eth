const { ethers } = require('./ethereum');

function prefixMessage(message) {
    return ethers.utils.solidityKeccak256(
        ['string', 'bytes32'],
        ['\x19Ethereum Signed Message:\n32', message]
    );
}

function validateOrderHash(
    orderHashToCompare,
    makerAddress,
    makerSellTokenAddress,
    makerSellTokenAmount,
    makerBuyTokenAddress,
    makerBuyTokenAmount,
    nonce,
    exchangeAddress
) {
    const orderHash = ethers.utils.solidityKeccak256(
        ['address', 'address', 'uint256', 'address', 'uint256', 'uint256', 'address'],
        [
            makerAddress,
            makerSellTokenAddress,
            makerSellTokenAmount.toString(),
            makerBuyTokenAddress,
            makerBuyTokenAmount.toString(),
            nonce,
            exchangeAddress,
        ]
    );

    return {
        isValidOrderHash: orderHash === orderHashToCompare,
        producedOrderHash: orderHash,
    };
}

function recoverAddress(orderHash, signature) {
    const prefixedMessage = prefixMessage(orderHash);
    return ethers.utils.recoverAddress(prefixedMessage, signature);
}

function validateSignature(address, orderHash, signature) {
    try {
        const recoveredAddress = recoverAddress(orderHash, signature);
        const isValidSigner = recoveredAddress.toLowerCase() === address.toLowerCase();
        if (isValidSigner) {
            return {
                isValidSigner,
                recoveredAddress,
            };
        }
        return {
            isValidSigner,
            recoveredAddress,
            message: 'Incorrect signer',
        };
    } catch (error) {
        return {
            isValidSigner: false,
            message: 'Incorrect signature',
        };
    }
}

function isAddress(address) {
    return /^0x[0-9a-fA-F]{40}$/.test(address);
}

function isOrderHash(address) {
    return /^0x[0-9a-fA-F]{64}$/.test(address);
}

function isNumber(number) {
    return /^[1-9][0-9]*$|^[0-9]$/.test(number);
}

function validate(
    signature,
    orderHash,
    makerAddress,
    makerSellTokenAddress,
    makerSellTokenAmount,
    makerBuyTokenAddress,
    makerBuyTokenAmount,
    nonce,
    exchangeAddress
) {
    if (!isAddress(makerAddress)) {
        const returnedData = {
            valid: false,
            address: makerAddress,
            message: 'Invalid maker address',
        };

        return returnedData;
    }

    if (!isAddress(makerSellTokenAddress)) {
        const returnedData = {
            valid: false,
            address: makerSellTokenAddress,
            message: 'Invalid maker sell token address',
        };

        return returnedData;
    }

    if (!isAddress(makerBuyTokenAddress)) {
        const returnedData = {
            valid: false,
            address: makerBuyTokenAddress,
            message: 'Invalid maker buy token address',
        };

        return returnedData;
    }

    if (!isAddress(exchangeAddress)) {
        const returnedData = {
            valid: false,
            address: exchangeAddress,
            message: 'Invalid exchange address',
        };

        return returnedData;
    }

    if (!isNumber(makerSellTokenAmount.toString())) {
        const returnedData = {
            valid: false,
            amount: makerSellTokenAmount,
            message: 'Invalid maker sell token amount',
        };

        return returnedData;
    }

    if (!isNumber(makerBuyTokenAmount.toString())) {
        const returnedData = {
            valid: false,
            amount: makerSellTokenAmount,
            message: 'Invalid maker sell token amount',
        };

        return returnedData;
    }

    if (!isNumber(nonce.toString())) {
        const returnedData = { valid: false, amount: nonce, message: 'Invalid nonce' };

        return returnedData;
    }

    const { isValidOrderHash, producedOrderHash } = validateOrderHash(
        orderHash,
        makerAddress,
        makerSellTokenAddress,
        makerSellTokenAmount,
        makerBuyTokenAddress,
        makerBuyTokenAmount,
        nonce,
        exchangeAddress
    );

    if (!isValidOrderHash) {
        const returnedData = {
            valid: isValidOrderHash,
            producedOrderHash,
            message: 'Incorrect order hash',
        };

        return returnedData;
    }

    const { isValidSigner, recoveredAddress, message } = validateSignature(
        makerAddress,
        producedOrderHash,
        signature
    );

    if (!isValidSigner) {
        const returnedData = { valid: isValidSigner, recoveredAddress, message };

        return returnedData;
    }

    return { valid: true };
}

module.exports = {
    prefixMessage,
    validateOrderHash,
    recoverAddress,
    validateSignature,
    validate,
};
