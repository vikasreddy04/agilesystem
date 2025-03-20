import React, { useState } from 'react';
import './Admin.css';

const Admin = () => {
  const [scrumTeams, setScrumTeams] = useState([]);
  const [newScrum, setNewScrum] = useState({ name: '', taskTitle: '', taskDesc: '', status: 'To Do', assignTo: '' });

  const handleInputChange = (e) => {
    setNewScrum({ ...newScrum, [e.target.name]: e.target.value });
  };

  const handleAddScrum = () => {
    if (!newScrum.name || !newScrum.taskTitle || !newScrum.taskDesc || !newScrum.assignTo) {
      alert('All fields are required');
      return;
    }
    setScrumTeams([...scrumTeams, newScrum]);
    setNewScrum({ name: '', taskTitle: '', taskDesc: '', status: 'To Do', assignTo: '' });
  };

  return (
    <div className="admin-container">
        <h2>Admin Dashboard</h2>

        {/* Add New Scrum Section */}
        <div className="add-scrum-container">
            <h3>Add New Scrum</h3>
            <input type="text" name="name" placeholder="Scrum Name" value={newScrum.name} onChange={handleInputChange} />
            <input type="text" name="taskTitle" placeholder="Task Title" value={newScrum.taskTitle} onChange={handleInputChange} />
            <input type="text" name="taskDesc" placeholder="Task Description" value={newScrum.taskDesc} onChange={handleInputChange} />
            <select name="status" value={newScrum.status} onChange={handleInputChange}>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
            </select>
            <input type="text" name="assignTo" placeholder="Assign To (User Email)" value={newScrum.assignTo} onChange={handleInputChange} />
            <button onClick={handleAddScrum}>Create Scrum</button>
        </div>

        {/* Scrum Teams List */}
        <div className="scrum-teams-container">
            <h3>Scrum Teams</h3>
            <ul>
                {scrumTeams.map((team, index) => (
                    <li key={index}>
                        <strong>{team.name}</strong> - {team.taskTitle} ({team.status})
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

};

export default Admin;
