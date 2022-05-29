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
my_address = "0x7043476B5103F749C53d39a976042a445a8DA117"
private_key = "0x91a763e2713fbeda50c18487c7c4808ee9937227dd95c917ff6179064cb6559f"

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