import React from 'react';

const UserList = ({ users, onUserSelect }) => {
  return (
    <div style={{ width: '200px', padding: '10px', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
      <h2>User List</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {users.map((user) => (
          <li 
            key={user.id} 
            onClick={() => onUserSelect(user)} 
            style={{ cursor: 'pointer', padding: '5px', borderBottom: '1px solid #eee' }}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;