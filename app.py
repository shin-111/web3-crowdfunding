from crypt import methods
from flask import Flask, render_template, request
from web3 import Web3

app = Flask(__name__)


@app.route("/", methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        pass


    return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True)
