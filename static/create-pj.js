import { contractAddress, ABI } from "./const.js";

// Event listeners:

const createButton = document.querySelector("#create_button");
const createForm = document.querySelector("#create_form");
createButton.addEventListener("click", event => {
    event.preventDefault();
    createProject();
});


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
        ).then(
            createForm.submit()
        );
    } else {
        console.log("Please install MetaMask");
    }
}
