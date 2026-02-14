import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Entry from './pages/Entry';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Register from './pages/Register';
import SecuritySetup from './pages/SecuritySetup';
import Home from './pages/Home';
import PodcastDetail from './pages/PodcastDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/entry" element={<Entry />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/security" element={<SecuritySetup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/podcast/:id" element={<PodcastDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
