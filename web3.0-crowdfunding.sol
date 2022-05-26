// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract FundAndVote {

    uint idDigit = 16;
    uint idModulus = 10 ** idDigit; 

    struct Project {
        uint projectID;
        uint fundNeeded; // in wei?
        uint fundAccumulated; // in wei?
        uint[] milestones; // seconds for each milestones, example [30000, 30000, 40000] = 30000 sec, 30000 sec, 40000 sec
        uint currentMilestone;
        uint startDate;
        uint thumbDown;
        bool greenLight;
        address creator;
        mapping(address => uint) investorToAmount;
    }

    uint[] public projectID;
    mapping(uint => Project) public idToProject;
    mapping(uint => address[]) idToInvestors;

    function createProject(string memory _projectName, uint _fundNeeded, uint[] memory _milestones) public {
        uint ID = uint(keccak256(abi.encodePacked(_projectName))) % idModulus;
        projectID.push(ID);
        idToProject[ID].projectID = ID;
        idToProject[ID].fundNeeded = _fundNeeded;
        idToProject[ID].fundAccumulated = 0;
        idToProject[ID].milestones = _milestones;
        idToProject[ID].currentMilestone = 0;
        idToProject[ID].startDate = block.timestamp;
        idToProject[ID].thumbDown = 0;
        idToProject[ID].greenLight = false;
        idToProject[ID].creator = msg.sender;
    }

    function investProject(uint _projectName, uint _amountInvest) public payable {
        uint ID = uint(keccak256(abi.encodePacked(_projectName))) % idModulus;

        // require that investor hasn't invested in this project before
        require(idToProject[ID].investorToAmount[msg.sender] == 0);

        idToProject[ID].fundAccumulated  += _amountInvest;
        idToProject[ID].investorToAmount[msg.sender] = _amountInvest;
        idToInvestors[ID].push(msg.sender);

        // +send fund

        if (idToProject[ID].fundAccumulated >= idToProject[ID].fundNeeded) {
            idToProject[ID].greenLight = true;
            _releaseFund(ID);
        }
    }

    function vote(uint _projectName, uint _voteChoice) public {
        uint ID = uint(keccak256(abi.encodePacked(_projectName))) % idModulus;

        // only allow investors of the project to vote
        require(idToProject[ID].investorToAmount[msg.sender] > 0);

        // vote can only be 0 or 1
        if (_voteChoice == 1) {
            idToProject[ID].thumbDown += 1;
        }

        // check if milestone has expired
    	if (block.timestamp >= idToProject[ID].startDate + idToProject[ID].milestones[idToProject[ID].currentMilestone]) {
            if (idToProject[ID].thumbDown > (idToInvestors[ID].length/2)) {
                _stopProject(ID);
            } else {
                idToProject[ID].startDate = idToProject[ID].startDate + idToProject[ID].milestones[idToProject[ID].currentMilestone];
                idToProject[ID].thumbDown = 0;
                _releaseFund(ID);
            }
        }
    }

    function _releaseFund(uint _projectID) private {
        require(idToProject[_projectID].greenLight == true);
        // Track current milestone
        if (idToProject[_projectID].currentMilestone < idToProject[_projectID].milestones.length) {
            idToProject[_projectID].currentMilestone++;
        }
        // Transfer milestone fund to creator
        uint transferAmount = idToProject[_projectID].fundNeeded / idToProject[_projectID].milestones.length;
        payable(idToProject[_projectID].creator).transfer(transferAmount);
        idToProject[_projectID].fundAccumulated -= transferAmount;
    }

    function _stopProject(uint _projectID) private {
        idToProject[_projectID].greenLight = false;
        _payBackInvestors(_projectID);
    }

    function _payBackInvestors(uint _projectID) private {
        // Payback all investors the amount propotioned to their invested amount, using the remaining fund 
        for (uint i = 1; i < idToInvestors[_projectID].length; i++) {
            address currentInvestor = idToInvestors[_projectID][i];
            uint amountPay = idToProject[_projectID].investorToAmount[currentInvestor] * idToProject[_projectID].fundAccumulated / idToProject[_projectID].fundNeeded;
            payable(currentInvestor).transfer(amountPay);
            idToProject[_projectID].fundAccumulated -= amountPay;
        }
    }
}

// change: pass the whole project struct to functions instead of just the ID and have to look up everytime