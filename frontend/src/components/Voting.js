import React, { useState, useEffect } from 'react';
const Voting = ({data}) => {
    console.log(data)
    const [votingDetail, setVotingDetail] = useState(null)
    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:8000/get?id=${data.id}`);
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setVotingDetail(result);
        } catch (error) {
            console.error(error.message);
        }
      };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div>
            {votingDetail !== null && votingDetail.results.map((voting, index) => (
          <div key={index}>
            <h4>{voting.candidate} : {voting.votes}</h4>
          </div>
        ))}
        </div>
    )
}

export default Voting;