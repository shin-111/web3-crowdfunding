from flask import Flask, render_template

app = Flask(__name__)


@app.route("/", methods=["POST", "GET"])
def index():
    return render_template("index.html")
    

if __name__ == "__main__":
    app.run(debug=True)


# https://www.digitalocean.com/community/tutorials/how-to-use-web-forms-in-a-flask-application
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
