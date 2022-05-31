import { contractAddress, ABI } from "./const.js";

// Event listeners:
const connectButton1 = document.querySelector(".connect_wallet_1");
const connectButton2 = document.querySelector(".connect_wallet_2");

const createButton = document.querySelector("#create_button");
connectButton1.addEventListener("click", connectWallet);
connectButton2.addEventListener("click", connectWallet);

createButton.addEventListener("click", (e) => {e.preventDefault()});
createButton.addEventListener("click", createProject);


// Functions:
async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
        await ethereum.request({ method: "eth_requestAccounts" });
    } else {
        console.log("Please install MetaMask");
    }
}

async function createProject() {
    let projectName = document.querySelector("#project_name").value;
    let projectDescription = document.querySelector("#project_description").value;
    let projectFunding = document.querySelector("#project_fund").value;
    let projectMilestones = document.querySelector("#project_milestones").value;

    projectFunding = parseInt(projectFunding);
    projectMilestones = [projectMilestones.split(",").map(Number)];

    if (typeof window.ethereum !== "undefined") {
        const web3 = new Web3(window.ethereum);
        const walletAddress = await web3.eth.requestAccounts();
        const my_address = walletAddress[0];
        const contract = new web3.eth.Contract(ABI, contractAddress);
        await contract.methods.createProject(projectName, projectFunding, projectMilestones).send(
            {from: my_address}
        );

    } else {
        console.log("Please install MetaMask");
    }
}