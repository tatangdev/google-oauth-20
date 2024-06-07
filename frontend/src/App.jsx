import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import WhoAmI from './pages/WhoAmI.jsx'; // Make sure to import your WhoAmI component


export const baseApiURL = 'http://localhost:3000/api';

function App() {
  return (
    <div className="App">
      <Login />

      <Router>
        <div className="App">
          <Routes>
            <Route path="/whoami" element={<WhoAmI />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
