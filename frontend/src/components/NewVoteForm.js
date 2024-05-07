import React, { useState } from 'react';
import { Button, Input, Space, Table, notification} from 'antd';

const NewVotingForm = () => {
  const [options, setOptions] = useState([]);
  const [optionInput, setOptionInput] = useState('');
  const [participants, setParticipants] = useState([]);
  const [votingName, setVotingName] = useState('');
  const [endTime, setEndTime] = useState(null);

  const handleAddOption = () => {
    setOptions([...options, optionInput]);
    setParticipants([...participants, { key: optionInput, name: optionInput }]);
    setOptionInput('');
  };

  const handleSubmit = async () => {
    try {
        const response = await fetch('http://localhost:8000/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            options : options,
            name: votingName,
            date: endTime,
            }),
        });
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        const result = await response.json();
        notification.success({
        message: 'New Voting created successfully',
        });
        setOptions([]);
        setOptionInput('');
        setEndTime(null)
        setVotingName('');
        setParticipants([]);
    } catch (error) {
        notification.error({
        message: 'New Voting creation failed',
        });
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  return (
    <div>
      <h2>Create New Voting</h2>
      {/* <Space direction="vertical"> */}
        <Input 
          value={votingName} 
          onChange={e => setVotingName(e.target.value)} 
          placeholder="Voting Name" 
        />
        <input 
        type="datetime-local" 
        value={endTime} 
        onChange={(e) => setEndTime(e.target.value)} 
        />

        <Table columns={columns} dataSource={participants} />
        <Input 
          value={optionInput} 
          onChange={e => setOptionInput(e.target.value)} 
          placeholder="Option Name" 
        />
        <Button onClick={handleAddOption}>Add Option</Button>
        <Button type="primary" onClick={handleSubmit}>Create Voting</Button>
      {/* </Space> */}
    </div>
  );
};

export default NewVotingForm;
