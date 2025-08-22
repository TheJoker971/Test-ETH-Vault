// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title TestToken
 * @dev Un token ERC-20 simple pour tester l'API ethvaultapitest
 * @author EthVault Team
 */
contract TestToken {
    string public name = "EthVault Test Token";
    string public symbol = "EVTT";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    address public owner;
    bool public paused = false;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 value);
    event Burn(address indexed from, uint256 value);
    event Pause();
    event Unpause();
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    constructor(uint256 _initialSupply) {
        owner = msg.sender;
        totalSupply = _initialSupply * 10**decimals;
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    // ==================== VIEW FUNCTIONS ====================
    
    /**
     * @dev Retourne le nom du token
     */
    function getName() public view returns (string memory) {
        return name;
    }
    
    /**
     * @dev Retourne le symbole du token
     */
    function getSymbol() public view returns (string memory) {
        return symbol;
    }
    
    /**
     * @dev Retourne les décimales du token
     */
    function getDecimals() public view returns (uint8) {
        return decimals;
    }
    
    /**
     * @dev Retourne le supply total
     */
    function getTotalSupply() public view returns (uint256) {
        return totalSupply;
    }
    
    /**
     * @dev Retourne le balance d'une adresse
     */
    function getBalance(address _account) public view returns (uint256) {
        return balanceOf[_account];
    }
    
    /**
     * @dev Retourne l'owner du contrat
     */
    function getOwner() public view returns (address) {
        return owner;
    }
    
    /**
     * @dev Vérifie si le contrat est en pause
     */
    function isPaused() public view returns (bool) {
        return paused;
    }
    
    /**
     * @dev Retourne des informations complètes sur le token
     */
    function getTokenInfo() public view returns (
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _totalSupply,
        address _owner,
        bool _paused
    ) {
        return (name, symbol, decimals, totalSupply, owner, paused);
    }
    
    // ==================== STANDARD ERC-20 FUNCTIONS ====================
    
    function transfer(address _to, uint256 _value) public whenNotPaused returns (bool success) {
        require(_to != address(0), "Transfer to zero address");
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    
    function approve(address _spender, uint256 _value) public whenNotPaused returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    function transferFrom(address _from, address _to, uint256 _value) public whenNotPaused returns (bool success) {
        require(_to != address(0), "Transfer to zero address");
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Insufficient allowance");
        
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        
        emit Transfer(_from, _to, _value);
        return true;
    }
    
    // ==================== OWNER FUNCTIONS ====================
    
    function mint(address _to, uint256 _amount) public onlyOwner {
        require(_to != address(0), "Mint to zero address");
        
        totalSupply += _amount;
        balanceOf[_to] += _amount;
        
        emit Mint(_to, _amount);
        emit Transfer(address(0), _to, _amount);
    }
    
    function burn(uint256 _amount) public {
        require(balanceOf[msg.sender] >= _amount, "Insufficient balance to burn");
        
        balanceOf[msg.sender] -= _amount;
        totalSupply -= _amount;
        
        emit Burn(msg.sender, _amount);
        emit Transfer(msg.sender, address(0), _amount);
    }
    
    function pause() public onlyOwner {
        paused = true;
        emit Pause();
    }
    
    function unpause() public onlyOwner {
        paused = false;
        emit Unpause();
    }
    
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
    }
    
    // ==================== UTILITY FUNCTIONS ====================
    
    /**
     * @dev Fonction pour distribuer des tokens de test (faucet)
     */
    function faucet() public {
        require(balanceOf[msg.sender] == 0, "Already received test tokens");
        uint256 faucetAmount = 1000 * 10**decimals; // 1000 tokens
        
        require(balanceOf[owner] >= faucetAmount, "Insufficient tokens in faucet");
        
        balanceOf[owner] -= faucetAmount;
        balanceOf[msg.sender] += faucetAmount;
        
        emit Transfer(owner, msg.sender, faucetAmount);
    }
    
    /**
     * @dev Retourne le timestamp actuel du block
     */
    function getCurrentTimestamp() public view returns (uint256) {
        return block.timestamp;
    }
    
    /**
     * @dev Retourne le numéro du block actuel
     */
    function getCurrentBlockNumber() public view returns (uint256) {
        return block.number;
    }
} 