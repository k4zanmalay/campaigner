// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract CampaignFactory {
    address[]  public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    } 

    function getDeployedCampaigns() public view returns(address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
        
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping (address => bool) approvals;
    }

    Request [] public requests;
    address public manager;
    uint public minimumContribution;
    mapping (address => bool) public approvers;
    uint public approversCount;

    modifier isManager() {
        require(msg.sender == manager, "Must be a manager");
        _;
    }

    constructor (uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution, "Not enough eth sent to be an approver");
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory description, uint value, address payable recipient) 
        public isManager {
        Request storage newRequest = requests.push();
        newRequest.description = description; 
        newRequest.value = value; 
        newRequest.recipient = recipient; 
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint requestId) public {
        Request storage request = requests[requestId];
        require (approvers[msg.sender], "Not an approver");
        require (!request.approvals[msg.sender], "Already voted");
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint requestId) public isManager {
        Request storage request = requests[requestId];
        require(request.approvalCount > (approversCount/2), "Not enough approvals");
        require (!request.complete, "Already finalized");
        request.recipient.transfer(request.value);
        requests[requestId].complete = true;
    }  

    function getSummary() public view returns(
        uint, uint, uint, uint, address    
    ) {
        return(
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns(uint) {
        return requests.length;
    }  
}
