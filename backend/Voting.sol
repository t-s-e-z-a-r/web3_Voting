pragma solidity ^0.5.16;

pragma experimental ABIEncoderV2;

contract Voting {
    struct VotingData {
        string name; // Назва голосування
        string[] candidateList; // Список кандидатів
        uint256 endTime; // Дата та час завершення голосування
        mapping (bytes32 => uint256) votesReceived; // Кількість голосів для кожного кандидата
    }

    VotingData[] public votings; // Масив для зберігання голосувань

    function createVoting(string memory _name, string[] memory _candidateNames, uint256 _endTime) public {
        votings.push(VotingData({
            name: _name,
            candidateList: _candidateNames,
            endTime: _endTime
        }));
    }

    function getVotingInfo(uint256 _votingId) public view returns (string memory, string[] memory, uint256, uint256[] memory) {
        return (
            votings[_votingId].name,
            votings[_votingId].candidateList,
            votings[_votingId].endTime,
            getVotes(_votingId)
        );
    }

    function getVotes(uint256 _votingId) internal view returns (uint256[] memory) {
        uint256 numCandidates = votings[_votingId].candidateList.length;
        uint256[] memory votes = new uint256[](numCandidates);
        for(uint256 i = 0; i < numCandidates; i++) {
            bytes32 candidateHash = keccak256(abi.encodePacked(votings[_votingId].candidateList[i]));
            votes[i] = votings[_votingId].votesReceived[candidateHash];
        }
        return votes;
    }

    function getAllVotingNames() external view returns (string[] memory, uint256[] memory) {
        string[] memory votingNames = new string[](votings.length);
        uint256[] memory indexes = new uint256[](votings.length);
        for (uint256 i = 0; i < votings.length; i++) {
            votingNames[i] = votings[i].name;
            indexes[i] = i;
        }
        
        return (votingNames, indexes);
    }

    function vote(uint256 _votingId, string memory _candidate) public {
        require(now < votings[_votingId].endTime, "Voting has ended");
        require(isValidCandidate(_votingId, _candidate), "Invalid candidate");

        bytes32 candidateHash = keccak256(abi.encodePacked(_candidate));
        votings[_votingId].votesReceived[candidateHash]++;
    }

    function isValidCandidate(uint256 _votingId, string memory _candidate) internal view returns (bool) {
        bytes32 candidateHash = keccak256(abi.encodePacked(_candidate)); // Перетворення рядка у хеш
        string[] memory candidateList = votings[_votingId].candidateList; // Отримання списку кандидатів для відповідного голосування
        for(uint i = 0; i < candidateList.length; i++) {
            if (keccak256(abi.encodePacked(candidateList[i])) == candidateHash) { // Порівняння хешів
                return true;
            }
        }
        return false;
    }
}
