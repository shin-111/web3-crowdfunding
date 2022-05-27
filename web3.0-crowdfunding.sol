// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract FundAndVote {
    uint256 idDigit = 16;
    uint256 idModulus = 10**idDigit;

    struct Project {
        uint256 projectID;
        uint256 fundNeeded; // in wei?
        uint256 fundAccumulated; // in wei?
        uint256[] milestones; // seconds for each milestones, example [30000, 30000, 40000] = 30000 sec, 30000 sec, 40000 sec
        uint256 currentMilestone;
        uint256 startDate;
        uint256 thumbDown;
        bool greenLight;
        address creator;
        mapping(address => uint256) investorToAmount;
        mapping(address => bool) investorToVote;
    }

    uint256[] public projectID;
    mapping(uint256 => Project) public idToProject;
    mapping(uint256 => address[]) public idToInvestors;

    function createProject(
        string memory _projectName,
        uint256 _fundNeeded,
        uint256[] memory _milestones
    ) public {
        uint256 ID = uint256(keccak256(abi.encodePacked(_projectName))) %
            idModulus;
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

    function investProject(string memory _projectName) public payable {
        uint256 ID = uint256(keccak256(abi.encodePacked(_projectName))) %
            idModulus;

        // require that investor hasn't invested in this project before
        require(idToProject[ID].investorToAmount[msg.sender] == 0);
        require(msg.value > 0);

        idToProject[ID].fundAccumulated += msg.value;
        idToProject[ID].investorToAmount[msg.sender] = msg.value;
        idToInvestors[ID].push(msg.sender);

        if (idToProject[ID].fundAccumulated >= idToProject[ID].fundNeeded) {
            idToProject[ID].greenLight = true;
            _releaseFund(ID);
        }
    }

    function vote(string memory _projectName, uint256 _voteChoice) public {
        uint256 ID = uint256(keccak256(abi.encodePacked(_projectName))) %
            idModulus;

        // only allow investors of the project to vote
        require(idToProject[ID].investorToAmount[msg.sender] > 0);

        // only allow each investor to vote once
        require(idToProject[ID].investorToVote[msg.sender] == false);

        // vote can only be 0 or 1
        if (_voteChoice == 1) {
            idToProject[ID].thumbDown += 1;
        }

        idToProject[ID].investorToVote[msg.sender] == true;

        // check if milestone has expired
        if (
            block.timestamp >=
            idToProject[ID].startDate +
                idToProject[ID].milestones[idToProject[ID].currentMilestone]
        ) {
            if (idToProject[ID].thumbDown > (idToInvestors[ID].length / 2)) {
                _stopProject(ID);
            } else {
                idToProject[ID].startDate =
                    idToProject[ID].startDate +
                    idToProject[ID].milestones[
                        idToProject[ID].currentMilestone
                    ];
                idToProject[ID].thumbDown = 0;
                _releaseFund(ID);
            }
        }
    }

    function _releaseFund(uint256 _projectID) private {
        require(idToProject[_projectID].greenLight == true);
        // Track current milestone
        if (
            idToProject[_projectID].currentMilestone <
            idToProject[_projectID].milestones.length
        ) {
            idToProject[_projectID].currentMilestone++;
        }
        // Transfer milestone fund to creator
        uint256 transferAmount = idToProject[_projectID].fundNeeded /
            idToProject[_projectID].milestones.length;
        payable(idToProject[_projectID].creator).transfer(transferAmount);
        idToProject[_projectID].fundAccumulated -= transferAmount;
    }

    function _stopProject(uint256 _projectID) private {
        idToProject[_projectID].greenLight = false;
        _payBackInvestors(_projectID);
    }

    function _payBackInvestors(uint256 _projectID) private {
        // Payback all investors the amount propotioned to their invested amount, using the remaining fund
        for (uint256 i = 1; i < idToInvestors[_projectID].length; i++) {
            address currentInvestor = idToInvestors[_projectID][i];
            uint256 amountPay = (idToProject[_projectID].investorToAmount[
                currentInvestor
            ] * idToProject[_projectID].fundAccumulated) /
                idToProject[_projectID].fundNeeded;
            payable(currentInvestor).transfer(amountPay);
            idToProject[_projectID].fundAccumulated -= amountPay;
        }
    }

    // View functions
    function viewProjectID() public view returns (uint256[] memory) {
        return projectID;
    }
}
