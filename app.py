from flask import Flask, render_template, jsonify, request, url_for
import json
# from web3 import Web3
# from deploy import deployed_address, w3, chain_id, abi

app = Flask(__name__)

@app.route("/", methods=["POST", "GET"])
def index():
    # if request.method == "POST":
    #     project_name = request.form["project_name"]
    #     project_description = request.form["project_description"]
    #     project_fund = request.form["project_fund"]
    #     project_milestones = request.form["project_milestones"]

    # contract = w3.eth.contract(address=deployed_address, abi=abi)
    # contract.functions.createProject(
    #     project_name,
    #     project_fund,
    #     project_milestones,
    # ).buildTransaction(
    #     {
    #         "chainId": chain_id,
    #         "gasPrice": w3.eth.gas_price,
    #         "from": "",
    #         "nonce": "",
    #     }
    # )

    return render_template("index.html")

#Serve ABI
@app.route("/abi")
def abi():
    file = open("compiled_code.json", "r")
    data = json.loads(file.read())
    abi = data["contracts"]["web3.0-crowdfunding.sol"]["FundAndVote"]["abi"]
    return jsonify(abi)

if __name__ == "__main__":
    app.run(debug=True)

# https://www.digitalocean.com/community/tutorials/how-to-use-web-forms-in-a-flask-application
