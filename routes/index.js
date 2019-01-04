const express = require('express');

const router = express.Router();

router.get('/', (__req, res) => {
    const result = { success: true };
    res.json(200, result);
});

module.exports = router;
