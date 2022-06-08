import json
from solcx import compile_standard, install_solc
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

with open("./web3.0-crowdfunding.sol", "r") as file:
    web3_crowdfunding_file = file.read()

install_solc("0.8.11")

# Compile smart contract
compiled_sol = compile_standard(
    {
        "language": "Solidity",
        "sources": {"web3.0-crowdfunding.sol": {"content": web3_crowdfunding_file}},
        "settings": {
            "outputSelection": {
                "*": {
                    "*": ["abi", "metadata", "evm.bytecode", "evm.bytecode.sourceMap"]
                }
            }
        },
    },
    solc_version="0.8.11",
)

with open("compiled_code.json", "w") as file:
    json.dump(compiled_sol, file)

# Get byte code
bytecode = compiled_sol["contracts"]["web3.0-crowdfunding.sol"]["FundAndVote"]["evm"][
    "bytecode"
]["object"]

# Get ABI
abi = compiled_sol["contracts"]["web3.0-crowdfunding.sol"]["FundAndVote"]["abi"]

# Connect to Ganache
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))
chain_id = 1337
my_address = "0x7A835D1A5DCa5F6Ae1eFaF2F90723b1072eF4c2f"
private_key = "0xba6db37132d23bae334b4314825be2f1e569a7ed37bed1d6a37f94320a70215d"

# Deploy the contract
Web3Crowdfunding = w3.eth.contract(abi=abi, bytecode=bytecode)
nonce = w3.eth.getTransactionCount(my_address)
transaction = Web3Crowdfunding.constructor().buildTransaction(
    {
        "chainId": chain_id,
        "gasPrice": w3.eth.gas_price,
        "from": my_address,
        "nonce": nonce,
    }
)
signed_tx = w3.eth.account.sign_transaction(transaction, private_key=private_key)
print("Deploying contract...")
tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
print("Waiting for transaction to finish...")
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
deployed_address = tx_receipt.contractAddress
print(f"Done! Contract deployed to {deployed_address}")