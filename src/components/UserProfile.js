import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import './UserProfile.css';

const UserProfile = () => {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newUserName, setNewUserName] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserPassword, setNewUserPassword] = useState("");
    const [newUserRole, setNewUserRole] = useState("employee");
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:4000/users");
                if (user && user.role === "admin") {
                    setUsers(response.data.filter((u) => u.role !== "admin"));
                } else {
                    setSelectedUser(user);
                    if (user) fetchTasks(user.id);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        if (user) fetchUsers();
    }, [user]);

    const fetchTasks = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:4000/tasks?assignedTo=${userId}`);
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleGetHistory = (userId) => {
        setSelectedUser(users.find((u) => u.id === userId));
        fetchTasks(userId);
    };

    const handleAddUser = async (event) => {
        event.preventDefault();

        try {
            await axios.post("http://localhost:4000/users", {
                name: newUserName,
                email: newUserEmail,
                password: newUserPassword,
                role: newUserRole,
            });

            const updatedUsers = await axios.get("http://localhost:4000/users");
            setUsers(updatedUsers.data.filter((u) => u.role !== "admin"));
            setShowForm(false); // Hide the form after submission
            setNewUserName("");
            setNewUserEmail("");
            setNewUserPassword("");
            setNewUserRole("employee");
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    return (
        <div className="user-profile-container">
            <h2>User Profiles</h2>

            {user && user.role === "admin" && (
                <div>
                    <button className="add-user-button" onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Cancel" : "Add New User"}
                    </button>

                    {showForm && (
                        <form className="user-form" onSubmit={handleAddUser}>
                            <div>
                                <label>Name:</label>
                                <input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required />
                            </div>
                            <div>
                                <label>Password:</label>
                                <input type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} required />
                            </div>
                            <div>
                                <label>Role:</label>
                                <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} required>
                                    <option value="employee">Employee</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button type="submit">Create User</button>
                        </form>
                    )}

                    <ul className="user-list">
                        {users.map((u) => (
                            <li key={u.id}>
                                <strong>Name:</strong> {u.name} <br />
                                <strong>Email:</strong> {u.email} <br />
                                <button onClick={() => handleGetHistory(u.id)}>Get History</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedUser && (
                <div>
                    <h3>Tasks Worked By {selectedUser.name}</h3>
                    <ul className="task-list">
                        {tasks.map((task) => (
                            <li key={task.id}>
                                <strong>Title:</strong> {task.title} <br />
                                <strong>Description:</strong> {task.description} <br />
                                <strong>Status:</strong> {task.status}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
