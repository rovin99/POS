import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';

const UnverifiedUsersList = ({ users, onApprove }) => {
  const handleApprove = (userId) => {
    axios
      .post('/api/users/approve', { user_id: userId })
      .then((response) => {
        console.log(response.data.message);
        onApprove(userId);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <ListGroup>
      {users.map((user) => (
        <ListGroup.Item key={user.user_id}>
          <div>
            <strong>{user.name}</strong>
            <p>{user.user_id}</p>
          </div>
          <Button variant="primary" onClick={() => handleApprove(user.user_id)}>
            Approve
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default UnverifiedUsersList;