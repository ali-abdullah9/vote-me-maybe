// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    // Enum to represent proposal status
    enum Status { Active, Pending, Passed, Rejected }
    
    // Enum to represent vote type
    enum VoteType { Approve, Reject }
    
    // Structure to store proposal data
    struct Proposal {
        uint256 id;
        address creator;
        string title;
        string description;
        uint256 approveCount; // Votes approving the proposal
        uint256 rejectCount;  // Votes rejecting the proposal
        uint256 totalVotes;   // Total votes (approve + reject)
        uint256 createdAt;
        Status status;
    }
    
    // Structure to store vote data
    struct Vote {
        uint256 proposalId;
        address voter;
        VoteType voteType;    // Whether approve or reject
        uint256 votedAt;
    }
    
    // Array to store all proposals
    Proposal[] private proposals;
    
    // Mapping to store votes by proposal
    mapping(uint256 => Vote[]) private proposalVotes;
    
    // Mapping to check if user has voted on a proposal
    mapping(uint256 => mapping(address => bool)) private hasVoted;
    
    // Events
    event ProposalCreated(uint256 indexed proposalId, address indexed creator, string title);
    event VoteCast(uint256 indexed proposalId, address indexed voter, VoteType voteType);
    event ProposalStatusChanged(uint256 indexed proposalId, Status newStatus);
    
    // Create a new proposal
    function createProposal(string memory _title, string memory _description) public returns (uint256) {
        uint256 proposalId = proposals.length;
        
        Proposal memory newProposal = Proposal({
            id: proposalId,
            creator: msg.sender,
            title: _title,
            description: _description,
            approveCount: 0,
            rejectCount: 0,
            totalVotes: 0,
            createdAt: block.timestamp,
            status: Status.Active
        });
        
        proposals.push(newProposal);
        
        emit ProposalCreated(proposalId, msg.sender, _title);
        
        return proposalId;
    }
    
    // Cast a vote on a proposal
    function castVote(uint256 _proposalId, VoteType _voteType) public {
        require(_proposalId < proposals.length, "Proposal does not exist");
        require(proposals[_proposalId].status == Status.Active, "Proposal is not active");
        require(!hasVoted[_proposalId][msg.sender], "Already voted on this proposal");
        
        hasVoted[_proposalId][msg.sender] = true;
        
        Vote memory newVote = Vote({
            proposalId: _proposalId,
            voter: msg.sender,
            voteType: _voteType,
            votedAt: block.timestamp
        });
        
        proposalVotes[_proposalId].push(newVote);
        
        // Update proposal vote counts
        if (_voteType == VoteType.Approve) {
            proposals[_proposalId].approveCount += 1;
        } else {
            proposals[_proposalId].rejectCount += 1;
        }
        
        proposals[_proposalId].totalVotes += 1;
        
        emit VoteCast(_proposalId, msg.sender, _voteType);
    }
    
    // Update a proposal's status
    function updateProposalStatus(uint256 _proposalId, Status _newStatus) public {
        require(_proposalId < proposals.length, "Proposal does not exist");
        require(proposals[_proposalId].creator == msg.sender, "Only the creator can update status");
        
        proposals[_proposalId].status = _newStatus;
        
        emit ProposalStatusChanged(_proposalId, _newStatus);
    }
    
    // Get a single proposal
    function getProposal(uint256 _proposalId) public view returns (Proposal memory) {
        require(_proposalId < proposals.length, "Proposal does not exist");
        return proposals[_proposalId];
    }
    
    // Get all proposals
    function getAllProposals() public view returns (Proposal[] memory) {
        return proposals;
    }
    
    // Get votes for a proposal
    function getProposalVotes(uint256 _proposalId) public view returns (Vote[] memory) {
        require(_proposalId < proposals.length, "Proposal does not exist");
        return proposalVotes[_proposalId];
    }
    
    // Check if a user has voted on a proposal
    function hasVotedOnProposal(uint256 _proposalId, address _voter) public view returns (bool) {
        require(_proposalId < proposals.length, "Proposal does not exist");
        return hasVoted[_proposalId][_voter];
    }
}