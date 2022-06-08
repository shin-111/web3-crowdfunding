// Event listeners:
const connectButton1 = document.querySelector(".connect_wallet_1");
const connectButton2 = document.querySelector(".connect_wallet_2");

connectButton1.addEventListener("click", connectWallet);
connectButton2.addEventListener("click", connectWallet);

// Functions:
async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
        await ethereum.request({ method: "eth_requestAccounts" });
    } else {
        console.log("Please install MetaMask");
    }
}