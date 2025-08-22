const { ethers } = require('ethers');
const asyncErrorHandler = require('../middlewares/helpers/asyncErrorHandler');
const ErrorHandler = require('../utils/errorHandler');

// Test endpoint to verify ethvaultapitest is working
exports.testEthvaultApi = asyncErrorHandler(async (req, res, next) => {
    console.log('🚀 EthVault API Test endpoint called');
    
    res.status(200).json({
        success: true,
        message: 'EthVault API Test is working!',
        timestamp: new Date().toISOString(),
        api_name: 'ethvaultapitest',
        endpoints: {
            test: '/api/v1/ethvaultapitest',
            contract_interaction: '/api/v1/ethvaultapitest/contract/:address',
            demo: '/api/v1/ethvaultapitest/demo'
        }
    });
});

// Demo endpoint with simulated smart contract data
exports.demoSmartContractData = asyncErrorHandler(async (req, res, next) => {
    console.log('🎭 Demo endpoint called - simulating smart contract interaction');
    
    // Simulate a successful smart contract call
    const simulatedContractData = {
        success: true,
        message: 'Demo: Simulated smart contract interaction',
        contract_address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        contract_name: 'Tether USD (USDT)',
        function_name: 'symbol',
        result: 'USDT',
        additional_info: {
            decimals: 6,
            total_supply: '46891737785381796',
            example_balance: '1000000000' // 1000 USDT (6 decimals)
        },
        simulation_note: 'This is simulated data to demonstrate API functionality',
        timestamp: new Date().toISOString()
    };
    
    console.log('✅ Demo data generated successfully');
    
    res.status(200).json(simulatedContractData);
});

// Get smart contract data
exports.getSmartContractData = asyncErrorHandler(async (req, res, next) => {
    const { address } = req.params;
    const { 
        functionName, 
        abi, 
        args = [], 
        rpcUrl = 'https://ethereum-sepolia.publicnode.com' 
    } = req.body;

    console.log(`🔗 Attempting to interact with smart contract at: ${address}`);
    console.log(`📝 Function: ${functionName}`);
    console.log(`📋 Arguments:`, args);

    // Validate required parameters
    if (!address) {
        return next(new ErrorHandler('Smart contract address is required', 400));
    }

    if (!functionName) {
        return next(new ErrorHandler('Function name is required', 400));
    }

    if (!abi) {
        return next(new ErrorHandler('Contract ABI is required', 400));
    }

    try {
        // Create provider (using a public RPC for demonstration)
        // In production, you should use your own RPC endpoint
        let provider;
        try {
            provider = new ethers.JsonRpcProvider(
                rpcUrl.includes('your-api-key') 
                    ? 'https://ethereum.publicnode.com' // Free public RPC
                    : rpcUrl
            );
            
            // Test provider connection
            await provider.getNetwork();
            console.log('✅ Provider connected successfully');
        } catch (providerError) {
            console.log('⚠️ Primary provider failed, trying fallback...');
            // Fallback to another public RPC
            provider = new ethers.JsonRpcProvider('https://cloudflare-eth.com');
        }

        // Create contract instance
        const contract = new ethers.Contract(address, abi, provider);

        // Check if function exists in contract
        if (!contract[functionName]) {
            return next(new ErrorHandler(`Function '${functionName}' not found in contract ABI`, 400));
        }

        // Call the contract function
        let result;
        if (args.length > 0) {
            result = await contract[functionName](...args);
        } else {
            result = await contract[functionName]();
        }

        // Convert BigNumber and BigInt results to string for JSON serialization
        const processResult = (data) => {
            if (typeof data === 'bigint') {
                return data.toString();
            }
            if (ethers.isBigNumber && ethers.isBigNumber(data)) {
                return data.toString();
            }
            if (Array.isArray(data)) {
                return data.map(processResult);
            }
            if (typeof data === 'object' && data !== null) {
                const processed = {};
                for (const [key, value] of Object.entries(data)) {
                    processed[key] = processResult(value);
                }
                return processed;
            }
            return data;
        };

        const processedResult = processResult(result);

        console.log('✅ Smart contract call successful');
        console.log('📊 Result:', processedResult);

        res.status(200).json({
            success: true,
            contract_address: address,
            function_name: functionName,
            arguments: args,
            result: processedResult,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Smart contract interaction error:', error.message);
        
        // Handle specific ethers errors
        if (error.code === 'CALL_EXCEPTION') {
            return next(new ErrorHandler(`Contract call failed: ${error.reason || 'Invalid function call'}`, 400));
        }
        
        if (error.code === 'INVALID_ARGUMENT') {
            return next(new ErrorHandler(`Invalid arguments provided: ${error.message}`, 400));
        }

        if (error.code === 'NETWORK_ERROR') {
            return next(new ErrorHandler('Network error: Unable to connect to Ethereum node', 500));
        }

        return next(new ErrorHandler(`Smart contract interaction failed: ${error.message}`, 500));
    }
}); 