const axios = require('axios');

// Configuration
const CONFIG = {
    CONTRACT_ADDRESS: '0x294EdBDadcE4c435A093383EdA82a5f2E22CA0C1',
    API_BASE_URL: 'http://localhost:4000/api/v1',
    SEPOLIA_RPC: 'https://ethereum-sepolia.publicnode.com'
};

// Couleurs pour les logs
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

// Fonctions disponibles dans le contrat TestToken
const contractFunctions = [
    {
        name: 'name',
        description: 'Récupère le nom du token ERC-20',
        abi: {"inputs": [], "name": "name", "outputs": [{"internalType": "string", "name": "", "type": "string"}], "stateMutability": "view", "type": "function"}
    },
    {
        name: 'symbol',
        description: 'Récupère le symbole du token',
        abi: {"inputs": [], "name": "symbol", "outputs": [{"internalType": "string", "name": "", "type": "string"}], "stateMutability": "view", "type": "function"}
    },
    {
        name: 'decimals',
        description: 'Récupère le nombre de décimales du token',
        abi: {"inputs": [], "name": "decimals", "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}], "stateMutability": "view", "type": "function"}
    },
    {
        name: 'totalSupply',
        description: 'Récupère le supply total du token',
        abi: {"inputs": [], "name": "totalSupply", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}
    },
    {
        name: 'owner',
        description: 'Récupère l\'adresse du propriétaire du contrat',
        abi: {"inputs": [], "name": "owner", "outputs": [{"internalType": "address", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"}
    },
    {
        name: 'paused',
        description: 'Vérifie si le contrat est en pause',
        abi: {"inputs": [], "name": "paused", "outputs": [{"internalType": "bool", "name": "", "type": "bool"}], "stateMutability": "view", "type": "function"}
    },
    {
        name: 'getTokenInfo',
        description: 'Récupère toutes les informations du token en une seule fois',
        abi: {"inputs": [], "name": "getTokenInfo", "outputs": [{"internalType": "string", "name": "_name", "type": "string"}, {"internalType": "string", "name": "_symbol", "type": "string"}, {"internalType": "uint8", "name": "_decimals", "type": "uint8"}, {"internalType": "uint256", "name": "_totalSupply", "type": "uint256"}, {"internalType": "address", "name": "_owner", "type": "address"}, {"internalType": "bool", "name": "_paused", "type": "bool"}], "stateMutability": "view", "type": "function"}
    },
    {
        name: 'getCurrentTimestamp',
        description: 'Récupère le timestamp actuel du bloc',
        abi: {"inputs": [], "name": "getCurrentTimestamp", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}
    }
];

async function callAPI(endpoint, data = null) {
    try {
        const config = {
            method: data ? 'POST' : 'GET',
            url: `${CONFIG.API_BASE_URL}${endpoint}`,
            headers: { 'Content-Type': 'application/json' }
        };
        
        if (data) config.data = data;
        
        const response = await axios(config);
        return { success: true, data: response.data };
    } catch (error) {
        return { 
            success: false, 
            error: error.response?.data || error.message 
        };
    }
}

async function testBasicAPI() {
    console.log(`${colors.cyan}${colors.bold}🧪 Test 1: API de base${colors.reset}`);
    
    const result = await callAPI('/ethvaultapitest');
    
    if (result.success) {
        console.log(`${colors.green}✅ Succès:${colors.reset} ${result.data.message}`);
        console.log(`${colors.yellow}📅 Timestamp:${colors.reset} ${result.data.timestamp}`);
        console.log(`${colors.blue}🔧 API Name:${colors.reset} ${result.data.api_name}`);
        return true;
    } else {
        console.log(`${colors.red}❌ Erreur:${colors.reset}`, result.error);
        return false;
    }
}

async function testContractFunction(func) {
    console.log(`\n${colors.cyan}${colors.bold}🧪 Test: ${func.name}()${colors.reset}`);
    console.log(`${colors.white}📝 Description: ${func.description}${colors.reset}`);
    
    const result = await callAPI(`/ethvaultapitest/contract/${CONFIG.CONTRACT_ADDRESS}`, {
        functionName: func.name,
        abi: [func.abi],
        rpcUrl: CONFIG.SEPOLIA_RPC
    });
    
    if (result.success) {
        console.log(`${colors.green}✅ Résultat:${colors.reset} ${colors.bold}${result.data.result}${colors.reset}`);
        console.log(`${colors.yellow}📍 Contrat:${colors.reset} ${result.data.contract_address}`);
        console.log(`${colors.blue}🔧 Fonction:${colors.reset} ${result.data.function_name}`);
        console.log(`${colors.magenta}⏰ Timestamp:${colors.reset} ${result.data.timestamp}`);
        return true;
    } else {
        console.log(`${colors.red}❌ Erreur:${colors.reset}`, result.error);
        return false;
    }
}

async function runFullDemonstration() {
    // Header
    console.log(`${colors.blue}${colors.bold}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.blue}${colors.bold}    🚀 DÉMONSTRATION FINALE - API ETHVAULTAPITEST 🚀${colors.reset}`);
    console.log(`${colors.blue}${colors.bold}${'='.repeat(60)}${colors.reset}\n`);
    
    console.log(`${colors.magenta}📍 Contrat Sepolia:${colors.reset} ${CONFIG.CONTRACT_ADDRESS}`);
    console.log(`${colors.magenta}🌐 RPC Endpoint:${colors.reset} ${CONFIG.SEPOLIA_RPC}`);
    console.log(`${colors.magenta}🔗 API Base URL:${colors.reset} ${CONFIG.API_BASE_URL}\n`);
    
    // Test API de base
    const basicTest = await testBasicAPI();
    
    if (!basicTest) {
        console.log(`${colors.red}❌ L'API de base ne fonctionne pas. Arrêt des tests.${colors.reset}`);
        return;
    }
    
    console.log(`\n${colors.yellow}${'─'.repeat(50)}${colors.reset}`);
    console.log(`${colors.yellow}${colors.bold}    TESTS DES FONCTIONS SMART CONTRACT${colors.reset}`);
    console.log(`${colors.yellow}${'─'.repeat(50)}${colors.reset}`);
    
    // Tests des fonctions du contrat
    let successCount = 0;
    const totalTests = contractFunctions.length;
    
    for (let i = 0; i < contractFunctions.length; i++) {
        const func = contractFunctions[i];
        const success = await testContractFunction(func);
        
        if (success) successCount++;
        
        // Pause entre les tests sauf pour le dernier
        if (i < contractFunctions.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    // Résumé final
    console.log(`\n${colors.blue}${colors.bold}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.blue}${colors.bold}                    RÉSULTATS FINAUX${colors.reset}`);
    console.log(`${colors.blue}${colors.bold}${'='.repeat(60)}${colors.reset}`);
    
    console.log(`${colors.white}📊 Tests d'API réussis: ${colors.green}${colors.bold}1/1${colors.reset}`);
    console.log(`${colors.white}📊 Tests de contrat réussis: ${colors.green}${colors.bold}${successCount}/${totalTests}${colors.reset}`);
    console.log(`${colors.white}📊 Total: ${colors.green}${colors.bold}${successCount + 1}/${totalTests + 1}${colors.reset}`);
    
    if (successCount === totalTests) {
        console.log(`\n${colors.green}${colors.bold}🎉 DÉMONSTRATION RÉUSSIE !${colors.reset}`);
        console.log(`${colors.green}✅ L'API ethvaultapitest fonctionne parfaitement avec votre contrat Sepolia !${colors.reset}`);
        console.log(`${colors.green}✅ Toutes les fonctions disponibles ont été testées avec succès !${colors.reset}`);
    } else {
        console.log(`\n${colors.yellow}⚠️  Démonstration partiellement réussie.${colors.reset}`);
    }
    
    // Informations techniques
    console.log(`\n${colors.cyan}${colors.bold}📋 INFORMATIONS TECHNIQUES:${colors.reset}`);
    console.log(`${colors.cyan}• Backend:${colors.reset} Node.js + Express + ethers.js`);
    console.log(`${colors.cyan}• Réseau:${colors.reset} Sepolia Testnet`);
    console.log(`${colors.cyan}• Contrat:${colors.reset} ${CONFIG.CONTRACT_ADDRESS}`);
    console.log(`${colors.cyan}• Fonctions testées:${colors.reset} ${contractFunctions.length} fonctions read-only`);
    console.log(`${colors.cyan}• Types supportés:${colors.reset} string, address, uint256, bool`);
    
    // Prochaines étapes
    console.log(`\n${colors.magenta}${colors.bold}🚀 PROCHAINES ÉTAPES:${colors.reset}`);
    console.log(`${colors.magenta}1.${colors.reset} Créer une vidéo de démonstration`);
    console.log(`${colors.magenta}2.${colors.reset} Pousser le code vers un dépôt public`);
    console.log(`${colors.magenta}3.${colors.reset} Documenter les endpoints API`);
    console.log(`${colors.magenta}4.${colors.reset} Ajouter le support pour d'autres réseaux`);
    
    console.log(`\n${colors.blue}${colors.bold}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.blue}${colors.bold}      🏁 FIN DE LA DÉMONSTRATION - MERCI ! 🏁${colors.reset}`);
    console.log(`${colors.blue}${colors.bold}${'='.repeat(60)}${colors.reset}`);
}

// Exécution
if (require.main === module) {
    console.log(`${colors.yellow}⚡ Démarrage de la démonstration finale en 3 secondes...${colors.reset}\n`);
    setTimeout(runFullDemonstration, 3000);
}

module.exports = { runFullDemonstration, testBasicAPI, testContractFunction }; 