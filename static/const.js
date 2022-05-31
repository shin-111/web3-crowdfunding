export const contractAddress = "0x35755a09a897DaEa653629BC86d37DB9de58F131";
export const ABI = [{
    "inputs": [{
        "internalType": "string",
        "name": "_projectName",
        "type": "string"
    }, {
        "internalType": "uint256",
        "name": "_fundNeeded",
        "type": "uint256"
    }, {
        "internalType": "uint256[]",
        "name": "_milestones",
        "type": "uint256[]"
    }],
    "name": "createProject",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "name": "idToInvestors",
    "outputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "name": "idToProject",
    "outputs": [{
        "internalType": "uint256",
        "name": "projectID",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "fundNeeded",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "fundAccumulated",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "currentMilestone",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "startDate",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "thumbDown",
        "type": "uint256"
    }, {
        "internalType": "bool",
        "name": "greenLight",
        "type": "bool"
    }, {
        "internalType": "address",
        "name": "creator",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "string",
        "name": "_projectName",
        "type": "string"
    }],
    "name": "investProject",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "name": "projectID",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "viewProjectID",
    "outputs": [{
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "string",
        "name": "_projectName",
        "type": "string"
    }, {
        "internalType": "uint256",
        "name": "_voteChoice",
        "type": "uint256"
    }],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}];