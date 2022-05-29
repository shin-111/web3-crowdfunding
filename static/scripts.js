import { contractAddress, ABI } from "./const.js";
import { ethers } from "./ethers-5.6.esm.min.js"

// Event listeners:
const connectButton = document.querySelector(".connect_wallet");
const createButton = document.querySelector("#create_button");
connectButton.addEventListener("click", connectWallet);
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
    const projectName = document.querySelector("#project_name").value;
    const projectDescription = document.querySelector("#project_description").value;
    const projectFunding = document.querySelector("#project_fund").value;
    const projectMilestones = document.querySelector("#project_milestones").value;

    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, ABI, signer);
        await contract.createProject(projectName, projectFunding, projectMilestones);

    } else {
        console.log("Please install MetaMask");
    }
}