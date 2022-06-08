import { contractAddress, ABI } from "./const.js";

// Event listeners:

const projectName = document.querySelector("#project_name_id").innerText;
const fundButton = document.querySelector("#fund_button");
// const fundForm = document.querySelector("#fund_form");
fundButton.addEventListener("click", event => {
    event.preventDefault();
    fundProject(projectName);
});

async function fundProject(projectName) {
    let fundAmount = document.querySelector("#amount_to_fund").value;

    if (typeof window.ethereum !== "undefinded") {
        const web3 = new Web3(window.ethereum);
        const walletAddress = await web3.eth.requestAccounts();
        const my_address = walletAddress[0];
        const contract = new web3.eth.Contract(ABI, contractAddress);
        await contract.methods.investProject(projectName).send(
            {from: my_address, value: web3.utils.toWei(fundAmount)}
        );
    } else {
        console.log("Please install MetaMask");
    }
}
