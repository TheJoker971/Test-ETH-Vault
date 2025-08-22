const express = require('express');
const { getSmartContractData, testEthvaultApi, demoSmartContractData } = require('../controllers/ethvaultController');

const router = express.Router();

// Test endpoint for ethvaultapitest
router.route('/ethvaultapitest').get(testEthvaultApi);

// Demo endpoint with simulated smart contract data
router.route('/ethvaultapitest/demo').get(demoSmartContractData);

// Smart contract interaction endpoint
router.route('/ethvaultapitest/contract/:address').post(getSmartContractData);

module.exports = router; 