import { useState, useEffect, useContext } from "react";
import axios from "axios";
import ScrumDetails from "./ScrumDetails";
import { UserContext } from "../context/UserContext";
import './Dashboard.css';

const Dashboard = () => {
    const [scrums, setScrums] = useState([]);
    const [selectedScrum, setSelectedScrum] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState([]);
    const [newScrumName, setNewScrumName] = useState("");
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [newTaskStatus, setNewTaskStatus] = useState("To Do");
    const [newTaskAssignedTo, setNewTaskAssignedTo] = useState("");
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchScrums = async () => {
            try {
                const response = await axios.get("http://localhost:4000/scrums");
                setScrums(response.data);
            } catch (error) {
                console.error("Error fetching scrums:", error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:4000/users");
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchScrums();
        fetchUsers();
    }, []);

    const handleGetDetails = async (scrumId) => {
        try {
            const response = await axios.get(`http://localhost:4000/scrums/${scrumId}`);
            setSelectedScrum(response.data);
        } catch (error) {
            console.error("Error fetching scrum details:", error);
        }
    };

    const handleAddScrum = async (event) => {
        event.preventDefault();

        try {
            // Add new Scrum
            const { data: newScrum } = await axios.post("http://localhost:4000/scrums", {
                name: newScrumName,
            });

            // Add new Task
            await axios.post("http://localhost:4000/tasks", {
                title: newTaskTitle,
                description: newTaskDescription,
                status: newTaskStatus,
                scrumId: newScrum.id,
                assignedTo: newTaskAssignedTo,
                history: [
                    {
                        status: newTaskStatus,
                        date: new Date().toISOString().split("T")[0], // Current date
                    },
                ],
            });

            // Update Scrum list after addition
            setScrums([...scrums, newScrum]);
            setShowForm(false); // Hide form after submission
            setNewScrumName("");
            setNewTaskTitle("");
            setNewTaskDescription("");
            setNewTaskStatus("To Do");
            setNewTaskAssignedTo("");
        } catch (error) {
            console.error("Error adding scrum:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Scrum Teams</h2>
    
            {user && user.role === "admin" && (
                <div>
                    <button onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Cancel" : "Add New Scrum"}
                    </button>
                    {showForm && (
                        <form className="form-container" onSubmit={handleAddScrum}>
                            <div>
                                <label>Scrum Name:</label>
                                <input
                                    type="text"
                                    value={newScrumName}
                                    onChange={(e) => setNewScrumName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Task Title:</label>
                                <input
                                    type="text"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Task Description:</label>
                                <input
                                    type="text"
                                    value={newTaskDescription}
                                    onChange={(e) => setNewTaskDescription(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Task Status:</label>
                                <select
                                    value={newTaskStatus}
                                    onChange={(e) => setNewTaskStatus(e.target.value)}
                                    required
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                            <div>
                                <label>Assign To:</label>
                                <select
                                    value={newTaskAssignedTo}
                                    onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                                    required
                                >
                                    <option value="">Select a user</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit">Create Scrum</button>
                        </form>
                    )}
                </div>
            )}
    
            <div className="scrum-list">
                <ul>
                    {scrums.map((scrum) => (
                        <li key={scrum.id}>
                            {scrum.name}
                            <button onClick={() => handleGetDetails(scrum.id)}>Get Details</button>
                        </li>
                    ))}
                </ul>
            </div>
    
            {selectedScrum && <ScrumDetails scrum={selectedScrum} />}
        </div>
    );
    
};

export default Dashboard;
