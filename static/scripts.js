async function loadWeb3() {
    if (window.ethereum) {
        w3 = new Web3(window.ethereum);
    } else {
        w3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
    }
}

async function loadContract() {
    let abi = [{'inputs': [{'internalType': 'string', 'name': '_projectName', 'type': 'string'}, {'internalType': 'uint256', 'name': '_fundNeeded', 'type': 'uint256'}, {'internalType': 'uint256[]', 'name': '_milestones', 'type': 'uint256[]'}], 'name': 'createProject', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'}, {'inputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}, {'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'name': 'idToInvestors', 'outputs': [{'internalType': 'address', 'name': '', 'type': 'address'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'name': 'idToProject', 'outputs': [{'internalType': 'uint256', 'name': 'projectID', 'type': 'uint256'}, {'internalType': 'uint256', 'name': 'fundNeeded', 'type': 'uint256'}, {'internalType': 'uint256', 'name': 'fundAccumulated', 'type': 'uint256'}, {'internalType': 'uint256', 'name': 'currentMilestone', 'type': 'uint256'}, {'internalType': 'uint256', 'name': 'startDate', 'type': 'uint256'}, {'internalType': 'uint256', 'name': 'thumbDown', 'type': 'uint256'}, {'internalType': 'bool', 'name': 'greenLight', 'type': 'bool'}, {'internalType': 'address', 'name': 'creator', 'type': 'address'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'string', 'name': '_projectName', 'type': 'string'}], 'name': 'investProject', 'outputs': [], 'stateMutability': 'payable', 'type': 'function'}, {'inputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'name': 'projectID', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [], 'name': 'viewProjectID', 'outputs': [{'internalType': 'uint256[]', 'name': '', 'type': 'uint256[]'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'string', 'name': '_projectName', 'type': 'string'}, {'internalType': 'uint256', 'name': '_voteChoice', 'type': 'uint256'}], 'name': 'vote', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'}]
    let address = "0xb04C0C31a18a1012f1577fB06EAaD84Dbc5c3883";
    return await new w3.eth.Contract(abi, address);
}

async function getCurrentAccount() {
    let accounts = await w3.eth.getAccounts();
    return accounts[0]
}

async function load() {
    await loadWeb3();
    let Web3Crowdfunding = await loadContract();

    document.getElementById("create_button").addEventListener("click", async function() {
        const account = await getCurrentAccount();
        Web3Crowdfunding.methods.createProject(
            document.getElementById("project_name"),
            document.getElementById("project_fund"),
            document.getElementById("project_milestones"),
        ).send({from:account});
    });
}

load()