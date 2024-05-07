import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import Web3 from 'web3';
import NewVotingForm from './components/NewVoteForm';
import Voting from './components/Voting'

const { TabPane } = Tabs;

const BlockchainData = () => {
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState({});
  const [votings, setVotings] = useState([]);
  const [showDetails, setShowDetails] = useState({})

  const loadBlockchainData = async () => {
    const web3 = new Web3('http://localhost:8545'); // Connection to Ganache
    const accounts = await web3.eth.getAccounts(); // Getting list of accounts
    const balanceMap = {};

    for (let account of accounts) {
      const balance = await web3.eth.getBalance(account);
      balanceMap[account] = web3.utils.fromWei(balance, 'ether'); // Converting balance to Ether
    }

    setAccounts(accounts);
    setBalances(balanceMap);

    const response = await fetch('http://localhost:8000/list');
    const data = await response.json();
    setVotings(data.votings);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const handleTabChange = (key) => {
    if (key === '2') {
      loadBlockchainData();
    }
  };

  function handleSelection(votingIndex) {
    setShowDetails(prevState => ({
        ...prevState,
        [votingIndex]: !prevState[votingIndex]
    }));
}

  return (
    <div style={{ maxWidth: 800, margin: '50px auto' }}>
      <Tabs defaultActiveKey="1" onChange={handleTabChange}>
        <Tabs.TabPane tab="Users" key="1">
          <div>
            <h1>Blockchain Users</h1>
            {accounts.map(account => (
              <p key={account}><strong>Account:</strong> {account} - <strong>Balance:</strong> {balances[account]} ETH</p>
            ))}
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Votings" key="2">
          <div>
            <h1>Blockchain Voting</h1>
            {votings.map((voting, index) => (
              <div key={index} onClick={() => handleSelection(index)}>
                <h3>Voting: {voting.name}</h3>
                {showDetails[index] && <Voting data={voting}/>}
              </div>
            ))}
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="New Voting" key="3">
          <div>
            <h1>Create New Voting</h1>
            <NewVotingForm />
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}  

export default BlockchainData;
