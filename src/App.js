import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import SignUp from './components/SignUp';
import { UserProvider, UserContext } from './context/UserContext';
import Admin from './components/Admin';
import { Pagenotfound } from './components/Pagenotfound';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div className="app">
          <Nav />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profiles" element={<UserProfile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Pagenotfound/>} />
           </Routes>
        </div>
      </Router>
    </UserProvider>
  );
};

const Nav = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate(); 

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/profiles">Profiles</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default App;
