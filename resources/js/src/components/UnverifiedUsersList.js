import React from 'react';
import { List, Button } from 'antd';
import axios from 'axios';

const UnverifiedUsersList = ({ users, onApprove }) => {
  const handleApprove = (userId) => {
    axios.post('/api/users/approve', { user_id: userId })
      .then(response => {
        console.log(response.data.message);
        onApprove(userId);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <List
      bordered
      dataSource={users}
      renderItem={(user) => (
        <List.Item>
          <List.Item.Meta
            title={user.name}
            description={user.user_id}
          />
          <Button type="primary" onClick={() => handleApprove(user.user_id)}>
            Approve
          </Button>
        </List.Item>
      )}
    />
  );
};

export default UnverifiedUsersList;